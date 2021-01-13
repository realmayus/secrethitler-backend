import Player from "./Player";
import Action from "./Action";
import ChatMessage from "./ChatMessage";
import { PlayerType, PolicyType } from "./Enums";
import { shuffleArray, uuidv4 } from "../util/util";
import Nomination from "./actions/Nomination";
import GameError from "./GameError";

const gameSetups = [
    {
        total: 5,
        liberals: 3,
        fascists: 1  // + Hitler
    }, {
        total: 6,
        liberals: 4,
        fascists: 1  // + Hitler
    }, {
        total: 7,
        liberals: 4,
        fascists: 2  // + Hitler
    }, {
        total: 8,
        liberals: 5,
        fascists: 2  // + Hitler
    }, {
        total: 9,
        liberals: 5,
        fascists: 3  // + Hitler
    }, {
        total: 10,
        liberals: 6,
        fascists: 3  // + Hitler
    }
]

class Game {

    constructor(name: string, minPlayers: number, maxPlayers: number) {
        this.name = name;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
    }

    id: number = Math.round(Math.random() * 200000);
    name: string;
    minPlayers: number;
    maxPlayers: number;
    hitler: Player;
    players: Player[] = [];
    deadPlayers: Player[] = [];
    fascists: Player[] = [];
    liberals: Player[] = [];
    policyDeck: PolicyType[] = [PolicyType.Liberal, PolicyType.Liberal, PolicyType.Liberal, PolicyType.Liberal, PolicyType.Liberal, PolicyType.Liberal, PolicyType.Fascist, PolicyType.Fascist, PolicyType.Fascist, PolicyType.Fascist, PolicyType.Fascist, PolicyType.Fascist, PolicyType.Fascist, PolicyType.Fascist, PolicyType.Fascist, PolicyType.Fascist, PolicyType.Fascist];
    declinedPolicyDeck: PolicyType[] = [];
    libPolicies = 0;  // Enacted lib policies
    fasPolicies = 0;  // Enacted fas policies
    president: Player;
    chancellor: Player;
    chancellorNominee: Player | undefined = undefined;
    electionTracker = 0;
    ineligiblePlayers: Player[] = [];
    currentAction: Action;
    spectators: Player[] = [];
    chatHistory: ChatMessage[] = [];
    typing: Player[] = [];


    join(player: Player) {
        this.players.push(player);
        console.log(`Player ${player.username} joined game ${this.name}.`)
        this.players.map((player) => this.broadcastToPlayer(player, this.serializeGameInfo(player)));
        this.broadcastToPlayer(player, {type: "chatHistory", messages: this.chatHistory})
        if (this.players.length >= this.minPlayers) {
            this.startGame();
        }
    }

    joinAsSpectator(player: Player) {
        this.spectators.push(player);
        console.log(`Spectator ${player.username} joined game ${this.name}.`)
    }

    startGame() {
        if (this.players.length < this.minPlayers) {
            throw new Error("Not enough players");
        }

        console.log(`Game ${this.name} has started.`)

        // Shuffle policy deck
        this.policyDeck = shuffleArray(this.policyDeck);

        this.president = this.players[Math.floor(Math.random() * this.players.length)]  // Nominate random player as president

        //Assign players the parties
        const gameSetup = gameSetups.find(x => x.total === this.players.length)
        console.log(`Using setup for ${this.players.length} players: ${JSON.stringify(gameSetup)}`);
        if (gameSetup == null) throw Error("No suitable setup found");
        let playersToAssign = [...this.players]
        playersToAssign = shuffleArray(playersToAssign)
        console.log("To assign:" + JSON.stringify(playersToAssign.map(p => p.userID)));
        while(this.fascists.length < gameSetup.fascists) {
            this.fascists.push(playersToAssign.pop());
        }
        while(this.liberals.length < gameSetup.liberals) {
            this.liberals.push(playersToAssign.pop());
        }
        this.hitler = playersToAssign.pop();

        if(playersToAssign.length > 0) throw Error("Didn't assign all players")

        //Broadcast game info
        this.players.map((player) => this.broadcastToPlayer(player, this.serializeGameInfo(player)));

        console.log("Nomination has started")
        this.currentAction = new Nomination(this)
    }

    /*
     CHAT
     */

    sendChatMessage(text: string, author: Player): ChatMessage {
        const msg = new ChatMessage(uuidv4(), text, author)
        console.log(msg);
        this.chatHistory.push(msg)
        const serializedMsg = {...msg}
        delete serializedMsg.author
        this.players.map((player) => this.broadcastToPlayer(player, {type: "newChatMessage", message: serializedMsg}));
        console.log(msg);
        return msg;
    }

    editChatMessage(msgId: string, newText: string, author: Player): void {
        const needle: ChatMessage = this.chatHistory.find((msg: ChatMessage) => msg.id === msgId)
        if(needle != null) {
            if (needle.author === author) {
                needle.edit(newText);
                const serializedMsg = { ...needle };
                delete serializedMsg.author;
                this.players.map((player) => this.broadcastToPlayer(player, {
                    type: "editChatMessage",
                    message: serializedMsg,
                }));
            } else {
                throw new GameError("Not authorized to edit message")
            }
        } else {
            throw new GameError("Couldn't find message")
        }
    }

    deleteChatMessage(msgId: string, author: Player): void {
        if (author.isModerator) {
            this.chatHistory.filter(msg => msg.id !== msgId);
            this.players.map((player) => this.broadcastToPlayer(player, {type: "deleteChatMessage", messageId: msgId}));
        } else {
            throw new GameError("Not authorized to delete message")
        }
    }

    setTyping(player: Player, typing: boolean): void {
        if (!typing && this.typing.includes(player)) {
            this.typing = this.typing.filter(x => x !== player);
            this.players.map((player) => this.broadcastToPlayer(player, {type: "typing", player: player.userID, isTyping: false}));
            return
        }
        this.typing.push(player);
        this.players.map((player) => this.broadcastToPlayer(player, {type: "typing", player: player.userID, isTyping: true}));
    }

    /*
    Returns the next player that will become president.
     */
    getNextPlayer(): Player {
        const presidentPosition = this.players.indexOf(this.president);
        return this.players[presidentPosition + 1 % (this.players.length - 1)]
    }

    getCardsFromDeck(): PolicyType[] {
        // Shuffle policy deck with declined policy deck because insufficient policies
        if (this.policyDeck.length < 3) {
            this.policyDeck = this.policyDeck.concat(this.declinedPolicyDeck);
            this.declinedPolicyDeck = [];
            this.policyDeck = shuffleArray(this.policyDeck);
        }
        return [this.policyDeck.pop(), this.policyDeck.pop(), this.policyDeck.pop()]
    }

    serializeGameInfo(player: Player) {
        //remove properties that would cause a circular structure in JSON
        const players = this.players.map(({ websocket, ...keepAttrs }) => keepAttrs);

        let currentAction = undefined;
        if (this.currentAction != null) {
            const {game, ...currentActionTemp} = this.currentAction;
            currentAction = currentActionTemp;
        }
        let role: PlayerType;
        if(this.fascists.includes(player)) {
            role = PlayerType.fascist;
        } else if (this.liberals.includes(player)) {
            role = PlayerType.liberal;
        } else if (this.hitler === player) {
            role = PlayerType.hitler;
        } else {
            role = PlayerType.spectator;
        }

        return {
            type: "gameInfo",
            name: this.name,
            maxPlayers: this.maxPlayers,
            yourRole: role,
            players: this.players.map((p) => p.userID),
            deadPlayers: this.deadPlayers.map((p) => p.userID),
            fascists: this.fascists.includes(player) ? this.fascists.map((p) => p.userID) : undefined,
            liberals: this.fascists.includes(player) ? this.liberals.map((p) => p.userID) : undefined,
            hitler: this.fascists.includes(player) ? this.hitler.userID : undefined,
            libPolicies: this.libPolicies,
            fasPolicies: this.fasPolicies,
            president: this.president != null ? this.president.userID : undefined,
            chancellor: this.chancellor != null ? this.chancellor.userID : undefined,
            gameTracker: this.electionTracker,
            ineligiblePlayers: this.ineligiblePlayers.map((p) => p.userID),
            currentAction: currentAction
        };

    }

    broadcastToPlayer(player: Player, x: any, tries?: number): void {
        if(player.websocket != null) {
            player.websocket.send(JSON.stringify(x));
        } else {
            console.log(player.websocket)
            if(tries == null) {
                setTimeout(() => {
                    this.broadcastToPlayer(player, x, 1)
                }, 3000)
            } else if(tries < 10) {
                setTimeout(() => {
                    this.broadcastToPlayer(player, x, tries + 1)
                }, 3000)
            } else {
                console.warn("Message broadcast to " + player.username + " cancelled after " + tries + " tries.")
            }

        }
    }
}

export default Game;
