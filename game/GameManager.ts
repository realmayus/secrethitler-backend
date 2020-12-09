import Game from "./Game";
import Player from "./Player";
import GameError from "./GameError";

export default class GameManager {

	games: Game[] = []

	getGameById(id: number): Game | undefined {
		return this.games.find((x) => x.id === id)
	}

	createGame(name: string, minPlayers: number, maxPlayers: number): Game {
		const new_game = new Game(name, minPlayers, maxPlayers);
		this.games.push(new_game);
		return new_game
	}

	// killGame(game: Game) {
	// 	game.end();
	// }

	forwardAction(game: Game, submittedBy: Player, actionType: string, actionSpecs: Record<string, any>): void {
		if(!game.players.includes(submittedBy)) {
			throw new GameError("You're not a part of the game")
		}
		if (game.currentAction.name !== actionType) {
			throw new GameError("Given action does not match current action in the game")
		}
		game.currentAction.handleActionSpecs(submittedBy, actionSpecs);
	}
}