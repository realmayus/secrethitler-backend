import Game from "./Game";
import Player from "./Player";
import GameError from "./GameError";

export const games: Game[] = []

export function getGameById(id: number): Game | undefined {
	return games.find((x) => x.id === id)
}

export function getGameByPlayer(player: Player): Game | undefined {
	return games.find((x) => x.players.some((p: Player) => p.userID === player.userID));
}

export function createGame(name: string, minPlayers: number, maxPlayers: number): Game {
	if(minPlayers >= 5 && maxPlayers <= 10) {
		const new_game = new Game(name, minPlayers, maxPlayers);
		games.push(new_game);
		return new_game
	} else {
		throw new GameError("minPlayers must be greater than/equal to 5 and maxPlayers must be less than/equal to 10.")
	}

}


export function joinGame(game: Game, player: Player): void {
	for (const gameTest of games) {
		if (gameTest.players.some((p: Player) => p.userID === player.userID)) {
			if(gameTest !== game) {
				throw new Error("Already in a game");
			} else {
				return;
			}
		}
	}
	game.join(player);
}

// killGame(game: Game) {
// 	game.end();
// }

export function forwardAction(game: Game, submittedBy: Player, actionType: string, actionSpecs: Record<string, any>): void {
	if(!game.players.includes(submittedBy)) {
		throw new GameError("You're not a part of the game")
	}
	if (game.currentAction == null) {
		throw new GameError("Currently, no action is in progress")
	}
	if (game.currentAction.name !== actionType) {
		throw new GameError("Given action does not match current action in the game")
	}
	game.currentAction.handleActionSpecs(submittedBy, actionSpecs);
}
