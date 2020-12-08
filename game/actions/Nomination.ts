import Action from "../Action";
import Player from "../Player";
import GameError from "../GameError.ts";
import Game from "../Game.ts";
import Election from "./Election.ts";

export default class Nomination extends Action {
    name = "nomination"
    game: Game;

    constructor(game: Game) {
        super();
        // this.number = number;
        this.game = game;
    }

    handleActionSpecs(submittedBy: Player, actionSpecs: Record<string, any>): void {
        if (submittedBy !== this.game.president) {
            throw new GameError("Action 'Nomination' has to be submitted by president!")
        }
        this.game.chancellorNominee = actionSpecs.nominee
        this.game.currentAction = new Election(game)
    }
}