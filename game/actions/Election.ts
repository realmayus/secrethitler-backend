import Action from "../Action";
import Game from "../Game.ts";
import Player from "../Player.ts";
import GameError from "../GameError.ts";

export default class Election extends Action {
    name = "election"
    game: Game
    votesJa: Player[] = []
    votesNein: Player[] = []
    voters: Player[] = []


    constructor(game: Game) {
        super();
        this.game = game;
    }


    handleActionSpecs(submittedBy: Player, actionSpecs: Record<string, any>): void {
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
        }

        if(this.votesJa.length + this.votesNein.length === this.game.players.length) {
            //TODO broadcast results
            //TODO Legislative
        }
    }
}