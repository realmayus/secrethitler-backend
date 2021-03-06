import Action from "../Action";
import Game from "../Game";
import { ActionStatus, GameEndReason, GameStatus, PolicyType } from "../Enums";
import Player from "../Player";
import GameError from "../GameError";
import Nomination from "./Nomination";

export default class Legislative extends Action {
    name = "legislative"
    game: Game;
    policies: PolicyType[];
    whoseTurn = "president";

    constructor(game: Game) {
        super();
        this.game = game;
        this.policies = this.game.getCardsFromDeck()

        this.game.players.map(p => p !== this.game.president && this.game.broadcastToPlayer(p, {
            type: "action",
            actionType: "legislative",
            status: ActionStatus.start,
            actionSpecs: { who: "president" }
        }));

        this.game.broadcastToPlayer(this.game.president, {
            type: "action", actionType: "legislative", status: ActionStatus.start, actionSpecs:
                {
                    policies: [
                        { type: this.policies[0] },
                        { type: this.policies[1] },
                        { type: this.policies[2] }
                    ]
                }
        });
    }


    handleActionSpecs(submittedBy: Player, actionSpecs: Record<string, any>): void {
        if (this.whoseTurn === "president") {
            if(this.game.president !== submittedBy) {
                throw new GameError("It's the president's turn and you're not the president")
            }
            if (actionSpecs.discard === PolicyType.Fascist) {
                this.policies.splice(this.policies.indexOf(PolicyType.Fascist), 1)
                this.game.declinedPolicyDeck.push(PolicyType.Fascist)
                this.whoseTurn = "chancellor"
            } else if (actionSpecs.discard === PolicyType.Liberal) {
                this.policies.splice(this.policies.indexOf(PolicyType.Liberal), 1)
                this.game.declinedPolicyDeck.push(PolicyType.Liberal)
                this.whoseTurn = "chancellor"
            } else {
                throw new GameError("Illegal argument")
            }
            this.game.broadcastToPlayer(this.game.chancellor, {
                type: "action", actionType: "legislative", status: ActionStatus.start, actionSpecs:
                    {
                        policies: [
                            { type: this.policies[0] },
                            { type: this.policies[1] }
                        ]
                    }
            });
        } else if (this.whoseTurn === "chancellor") {
            if(this.game.chancellor !== submittedBy) {
                throw new GameError("It's the chancellor's turn and you're not the chancellor")
            }
            if (actionSpecs.discard === PolicyType.Fascist) {
                this.game.declinedPolicyDeck.push(PolicyType.Fascist)
                this.policies.splice(this.policies.indexOf(PolicyType.Fascist), 1)
            } else if (actionSpecs.discard === PolicyType.Liberal) {
                this.policies.splice(this.policies.indexOf(PolicyType.Liberal), 1)
                this.game.declinedPolicyDeck.push(PolicyType.Liberal)
            } else {
                throw new GameError("Illegal argument")
            }

            this.game.players.map(p => this.game.broadcastToPlayer(p, {
                type: "action", actionType: "legislative", status: ActionStatus.end,
                actionSpecs:{ policy: this.policies[0] }
            }));

            this.game.players.map(p => this.game.broadcastToPlayer(p, this.game.serializeGameInfo(p)));
            if(this.game.fasPolicies !== 6 || this.game.libPolicies !== 5) {
                this.game.currentAction = new Nomination(this.game);
            } else if (this.game.fasPolicies === 6) {
                this.game.players.map((p: Player) => this.game.broadcastToPlayer(p, {
                    type: "gameStatus", status: GameStatus.end, reason: GameEndReason.fasPoliciesCompleted}));
            } else if (this.game.libPolicies === 5) {
                this.game.players.map((p: Player) => this.game.broadcastToPlayer(p, {
                    type: "gameStatus", status: GameStatus.end, reason: GameEndReason.libPoliciesCompleted}));
            }
        }


    }
}