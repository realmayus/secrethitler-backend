import { ExtWebSocket } from "../routes/sockets";

export default class Player {
    constructor(username: string, userID: number, avatar: string, matchesPlayed: number, timePlayed: number, matchesWon: number, matchesLost: number, email: string, isModerator: boolean) {
        this.username = username;
        this.userID = userID;
        this.avatar = avatar;
        this.matchesPlayed = matchesPlayed;
        this.timePlayed = timePlayed;
        this.matchesWon = matchesWon;
        this.matchesLost = matchesLost;
        this.email = email;
        this.isModerator = isModerator;
    }
    username: string;
    userID: number;
    avatar: string;
    matchesPlayed: number;
    timePlayed: number;
    matchesWon: number;
    matchesLost: number;
    email: string;
    isModerator: boolean;
    websocket: ExtWebSocket;

    serialize(confidential=false) {
        return {
            username: this.username,
            userID: this.userID,
            avatar: this.avatar,
            matchesPlayed: this.matchesPlayed,
            timePlayed: this.timePlayed,
            matchesWon: this.matchesWon,
            matchesLost: this.matchesLost,
            isModerator: this.isModerator,
            email: confidential ? this.email : undefined
        }
    }
}