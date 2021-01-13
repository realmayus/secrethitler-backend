
export const enum PolicyType {
    Liberal = "liberal",
    Fascist = "fascist",
}

export const enum ActionStatus {
    start = "start",
    end = "end"
}

export const enum PlayerType {
    hitler = "hitler",
    fascist = "fascist",
    liberal = "liberal",
    spectator = "spectator"
}

export const enum GameStatus {
    start = "start",
    end = "end"
}

export const enum GameEndReason {
    libPoliciesCompleted = "libPoliciesCompleted",
    fasPoliciesCompleted = "fasPoliciesCompleted",
    hitlerElected = "hitlerElected",
    hitlerKilled = "hitlerKilled"
}