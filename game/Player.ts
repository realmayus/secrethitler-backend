export default class Player {
    constructor(name: string, userID: number, avatar: string, matches_played: number, time_played: number, matches_won: number, matches_lost: number) {
        this.name = name;
        this.userID = userID;
        this.avatar = avatar;
        this.matches_played = matches_played;
        this.time_played = time_played;
        this.matches_won = matches_won;
        this.matches_lost = matches_lost;
    }
    name: string;
    userID: number;
    avatar: string;
    matches_played: number;
    time_played: number;
    matches_won: number;
    matches_lost: number;


    // saveToDB(): void {
    //
    // }



}