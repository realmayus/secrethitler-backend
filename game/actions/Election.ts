import Action from "../Action";
import Game from "../Game";
import Player from "../Player";
import { ActionStatus } from "../ActionStatus";
import Legislative from "./Legislative.ts";

export default class Election extends Action {
    name = "election"
    game: Game
    votesJa: Player[] = []
    votesNein: Player[] = []
    voters: Player[] = []


    constructor(game: Game) {
        super();
        this.game = game;

        this.game.players.map(p => this.game.broadcastToPlayer(p, {type: "action", actionType: "election", status: ActionStatus.start, actionSpecs: {nominee: this.game.chancellorNominee.userID}}));
    }


    handleActionSpecs(submittedBy: Player, actionSpecs: Record<string, any>): void {
        console.log("Received action from player " + submittedBy.name, actionSpecs)

        if (this.votesJa.includes(submittedBy)) { // change vote
            if(actionSpecs.vote === "nein") {
                this.votesJa.filter(p => p !== submittedBy) //remove from Ja votes
                this.votesNein.push(submittedBy);
            } else if(actionSpecs.vote == null) { // remove vote
                this.votesJa.filter(p => p !== submittedBy) // remove from Ja votes
                this.voters.filter(p => p !== submittedBy) // remove from players that voted
            }
        } else if (this.votesNein.includes(submittedBy)) { // change vote
            if(actionSpecs.vote === "ja") {
                this.votesNein.filter(p => p !== submittedBy) //remove from Nein votes
                this.votesJa.push(submittedBy);
            } else if(actionSpecs.vote == null) { // remove vote
                this.votesNein.filter(p => p !== submittedBy) // remove from Nein votes
                this.voters.filter(p => p !== submittedBy) // remove from players that voted
            }
        } else {
            if(actionSpecs.vote === "ja") {
                this.votesJa.push(submittedBy);
            } else if(actionSpecs.vote === "nein") {
                this.votesNein.push(submittedBy);
            }
        }

        if(this.votesJa.length + this.votesNein.length === this.game.players.length) {
            let didWin: boolean;
            if(this.votesJa.length <= this.votesNein.length) {
                this.game.electionTracker += 1;
                this.game.chancellorNominee = undefined;
                didWin = false;
            } else {
                this.game.chancellor = this.game.chancellorNominee;
                this.game.chancellorNominee = undefined;
                didWin = true;
                //TODO check if hitler & >=3 facist policies
            }
            this.game.players.map(p => this.game.broadcastToPlayer(p, {type: "action", actionType: "election", status: ActionStatus.end, actionSpecs:
                    {
                        nominee: this.game.chancellorNominee.userID,
                        outcome: didWin,
                        votesJa: this.votesJa.map(v => v.userID),
                        votesNein: this.votesNein.map(v => v.userID),
                    }}));
            this.game.currentAction = new Legislative()
        }
    }
}