import Game from "./Game.ts";

export default class GameManager {

	games: Game[] = []

	getGameById(id: number): Game | undefined {
		return this.games.find((x) => x.id === id)
	}

	createGame(name: string, minPlayers: number, maxPlayers: number): void {
		const new_game = new Game(name, minPlayers, maxPlayers);
		this.games.push(new_game);
	}

	killGame(game: Game) {
		game.end();
	}
	forwardAction(game: Game, actionType: string, actionSpecs: Record<string, any>) {
		if (game.currentAction.name !== actionType) {
			throw new Error("Given action does not match current action in the game")
		}
		game.currentAction.handleActionSpecs(actionSpecs);
	}
}