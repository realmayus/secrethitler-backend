import Player from "./Player";
import Action from "./Action";
import Waiting from "./actions/Waiting";
import { PolicyType } from "./PolicyType";
import { shuffleArray, wait } from "../util/util";
import Election from "./actions/Election";
import Nomination from "./actions/Nomination";
import Legislative from "./actions/Legislative";


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

    join(player: Player) {
        this.players.push(player);
        console.log(`Player ${player.name} joined game ${this.name}.`)

        if (this.players.length >= this.minPlayers) {
            this.startGame();
        }
    }

    joinAsSpectator(player: Player) {
        this.spectators.push(player);
        console.log(`Spectator ${player.name} joined game ${this.name}.`)
    }

    startGame() {
        if (this.players.length < this.minPlayers) {
            throw new Error("Not enough players");
        }

        console.log(`Game ${this.name} has started.`)

        // Shuffle policy deck
        this.policyDeck = shuffleArray(this.policyDeck);

        this.president = this.players[Math.floor(Math.random() * this.players.length)]  // Nominate random player as president
        this.players.map((player) => this.broadcastToPlayer(player, this.serializeGameInfo(player)));

        console.log("Nomination has started")
        this.currentAction = new Nomination(this)
    }


    /*
    Returns the next player that will become president.
     */
    getNextPlayer(): Player {
        const presidentPosition = this.players.indexOf(this.president);
        return this.players[presidentPosition + 1 % (this.players.length - 1)]
    }

    getCardsFromDeck() {
        // Shuffle policy deck with declined policy deck because insufficient policies
        if (this.policyDeck.length < 3) {
            this.policyDeck = this.policyDeck.concat(this.declinedPolicyDeck);
            this.declinedPolicyDeck = [];
            this.policyDeck = shuffleArray(this.policyDeck);
        }
        return [this.policyDeck.pop(), this.policyDeck.pop(), this.policyDeck.pop()]
    }

    serializeGameInfo(player: Player) {
        return JSON.stringify({
            name: this.name,
            maxPlayers: this.maxPlayers,
            players: this.players,
            deadPlayers: this.deadPlayers.map((p) => p.userID),
            fascists: this.fascists.includes(player) ? this.fascists.map((p) => p.userID) : undefined,
            liberals: this.fascists.includes(player) ? this.liberals.map((p) => p.userID) : undefined,
            hitler: this.fascists.includes(player) ? this.hitler : undefined,
            libPolicies: this.libPolicies,
            fasPolicies: this.fasPolicies,
            president: this.president != null ? this.president.userID : undefined,
            chancellor: this.chancellor != null ? this.chancellor.userID : undefined,
            gameTracker: this.electionTracker,
            ineligiblePlayers: this.ineligiblePlayers.map((p) => p.userID),
            currentAction: this.currentAction
        });

    }

    broadcastToPlayer(player: Player, x: any): void {
        console.log(x);
    }


}

export default Game;
