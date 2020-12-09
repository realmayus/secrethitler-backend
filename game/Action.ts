import { ActionStatus } from "./ActionStatus";
import Player from "./Player";

export default class Action {
    name = "";
    status: ActionStatus;

    start(): Promise< Record<string, unknown> | undefined > {
        throw new Error("Not implemented")
    }

    handleActionSpecs(submittedBy: Player, actionSpecs: Record<string, any>): void {
        throw new Error("Not implemented");
    }
}