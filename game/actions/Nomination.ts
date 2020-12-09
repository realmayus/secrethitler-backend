import Action from "../Action";
import Player from "../Player";
import GameError from "../GameError";
import Game from "../Game";
import Election from "./Election";
import { ActionStatus } from "../ActionStatus";

export default class Nomination extends Action {
    name = "nomination"
    game: Game;

    constructor(game: Game) {
        super();
        // this.number = number;
        this.game = game;
        this.game.players.map(p => this.game.broadcastToPlayer(p, {type: "action", actionType: "nomination", status: ActionStatus.start, actionSpecs: {ineligiblePlayers: this.game.ineligiblePlayers.map(p => p.userID)}}));
    }

    handleActionSpecs(submittedBy: Player, actionSpecs: Record<string, any>): void {
        console.log("Received action from player " + submittedBy.name, actionSpecs)
        // if (submittedBy !== this.game.president) {
        //     throw new GameError("Action 'Nomination' has to be submitted by president")
        // } TODO: uncomment this
        if (this.game.ineligiblePlayers.map((p) => p.userID).includes(actionSpecs.nominee.userID)) {
            throw new GameError("Nominee is ineligible for chancellorship")
        }
        this.game.chancellorNominee = actionSpecs.nominee
        this.game.players.map(p => this.game.broadcastToPlayer(p, {type: "action", actionType: "nomination", status: ActionStatus.end, actionSpecs: {ineligiblePlayers: this.game.ineligiblePlayers.map(p => p.userID)}}));
        this.game.currentAction = new Election(this.game)
    }
}