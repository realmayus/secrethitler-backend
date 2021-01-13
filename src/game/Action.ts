import Player from "./Player";
import Game from "./Game";

export default class Action {
    name = "";
    game: Game | undefined;


    handleActionSpecs(submittedBy: Player, actionSpecs: Record<string, any>): void {
        throw new Error("Not implemented");
    }
}