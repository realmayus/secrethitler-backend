import Player from '../game/Player';
import GameManager from "../game/GameManager";
import GameError from "../game/GameError";


const testplayer1 = new Player("test1", 1233214, "", 0, 0, 0, 0);
const testplayer2 = new Player("test2", 1233215, "", 0, 0, 0, 0);
const testplayer3 = new Player("test3", 1233216, "", 0, 0, 0, 0);
const testplayer4 = new Player("test4", 1233217, "", 0, 0, 0, 0);
const testplayer5 = new Player("test5", 1233218, "", 0, 0, 0, 0);

const gameManager = new GameManager();

const match = gameManager.createGame("test", 5, 7);

match.join(testplayer1);
match.join(testplayer2);
match.join(testplayer3);
match.join(testplayer4);
match.join(testplayer5);

try {
	gameManager.forwardAction(match, testplayer1, "nomination", {nominee: testplayer2});
} catch (e) {
	console.log("Couldn't execute action: " + e.name + ": " + e.message)
}

try {
	gameManager.forwardAction(match, testplayer1, "election", {vote: "ja"});
	gameManager.forwardAction(match, testplayer2, "election", {vote: "ja"});
	gameManager.forwardAction(match, testplayer3, "election", {vote: "ja"});
	gameManager.forwardAction(match, testplayer4, "election", {vote: "ja"});
	gameManager.forwardAction(match, testplayer5, "election", {vote: "ja"});
} catch (e) {
	console.log("Couldn't execute action: " + e.name + ": " + e.message)
}
