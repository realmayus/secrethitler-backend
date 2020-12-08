import Player from '../game/Player';
import Game from "../game/Game.ts";


const testplayer1 = new Player("test1", 1233214, "", 0, 0, 0, 0);
const testplayer2 = new Player("test2", 1233215, "", 0, 0, 0, 0);
const testplayer3 = new Player("test3", 1233216, "", 0, 0, 0, 0);
const testplayer4 = new Player("test4", 1233217, "", 0, 0, 0, 0);
const testplayer5 = new Player("test5", 1233218, "", 0, 0, 0, 0);

const match = new Game("test", 5, 7);



match.startGame();

match.join(testplayer1);
match.join(testplayer2);
match.join(testplayer3);
match.join(testplayer4);
match.join(testplayer5);