import { ActionStatus } from "./ActionStatus";

export default class Action {
    name = "";
    status: ActionStatus;

    start(): Promise< Record<string, unknown> | undefined > {
        throw new Error("Not implemented")
    }

    handleActionSpecs(): void {
        throw new Error("Not implemented");
    }
}