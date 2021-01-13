import express, { NextFunction, Request, Response } from "express";
import { createGame, games, getGameById, getGameByPlayer, joinGame } from "../game/GameManager";
import { getPlayerFromInfo } from "../util/app";
import Game from "../game/Game";

const router = express.Router();

router.get("/game/lobbies", (req, res) => {
	res.send({games:
		games
		.map((game: Game) => ({
			id: game.id,
			name: game.name,
			minPlayers: game.minPlayers,
			maxPlayers: game.maxPlayers,
			players: game.players.map(p => p.userID),
		})),
	});
})

router.post('/game/join', async function(req: Request, res: Response, next: NextFunction) {

	let token = req.cookies.token;

	if(token == null && req.body.token != null) {
		token = req.body.token;
	}
	const gameid = req.body.gameID

	const player = await getPlayerFromInfo(false, token)
	if(player == null) {
		next({error: "Not authorized", code: 403})
		return
	}

	const game = getGameById(Number(gameid));

	if (game == null) {
		next({ error: "Game doesn't exist", code: 404 })
		return
	}
	joinGame(game, player)
	res.send({status: "success", gameID: game.id, name: game.name})
});


router.post('/game/create', async function(req: Request, res: Response, next: NextFunction) {

	let token = req.cookies.token;

	if(token == null && req.body.token != null) {
		token = req.body.token;
	}

	const name = req.body.name;
	const minPlayers = req.body.minPlayers;
	const maxPlayers = req.body.maxPlayers;
	console.log("token", token);
	const player = await getPlayerFromInfo(false, token)
	if(player == null) {
		next({error: "Not authorized", code: 403})
		return
	}

	if (name == null || minPlayers == null || maxPlayers == null) {
		next({error: "Missing values", code: 400})
	}

	const game = createGame(name, Number(minPlayers), Number(maxPlayers));

	joinGame(game, player)
	res.send({status: "success", gameID: game.id, name: game.name})

	//TODO kill game if necessary


});



// Define the about route
router.get('/game/spectate', function(req: Request, res: Response) {
	//TODO implement
});


router.post("/game/sendMessage", async (req: Request, res: Response, next: NextFunction) => {
	let token = req.cookies.token;

	if(token == null && req.body.token != null) {
		token = req.body.token;
	}

	const messageText = req.body.message

	if(messageText == null || messageText.trim().length === 0) {
		next({error: "Message must not be empty", code: 400})
		return
	}
	const player = await getPlayerFromInfo(false, token)
	if(player == null) {
		next({error: "Not authorized", code: 403})
		return
	}

	const game = getGameByPlayer(player);
	if (game == null) {
		next({error: "Not in a game", code: 400})
		return
	}

	const msg = game.sendChatMessage(messageText, player);
	const serializedMsg = {...msg}
	delete serializedMsg.author
	res.send({status: "success", message: serializedMsg})
})

router.post("/game/editMessage", async (req: Request, res: Response, next: NextFunction) => {
	let token = req.cookies.token;

	if(token == null && req.body.token != null) {
		token = req.body.token;
	}

	const messageText = req.body.message
	const messageId = req.body.messageId

	if(messageText == null || messageText.trim().length === 0) {
		next({error: "Message must not be empty", code: 400})
		return
	}

	const player = await getPlayerFromInfo(false, token)
	if(player == null) {
		next({error: "Not authorized", code: 403})
		return
	}

	const game = getGameByPlayer(player);
	if (game == null) {
		next({error: "Not in a game", code: 400})
		return
	}
	game.editChatMessage(messageId, messageText, player)
	res.send({status: "success"});
})

router.post("/game/deleteMessage", async (req: Request, res: Response, next: NextFunction) => {
	let token = req.cookies.token;

	if(token == null && req.body.token != null) {
		token = req.body.token;
	}

	const messageId = req.body.messageId

	if(messageId == null) {
		next({error: "messageId must not be null", code: 400})
		return
	}

	const player = await getPlayerFromInfo(false, token)
	if(player == null) {
		next({error: "Not authorized", code: 403})
		return
	}

	const game = getGameByPlayer(player);
	if (game == null) {
		next({error: "Not in a game", code: 400})
		return
	}
	game.deleteChatMessage(messageId, player)
	res.send({status: "success"});
})


router.get("/game/setTyping", async (req: Request, res: Response, next: NextFunction) => {
	let token = req.cookies.token;

	if(token == null && req.body.token != null) {
		token = req.body.token;
	}

	const isTyping = req.body.isTyping

	if(isTyping == null) {
		next({error: "isTyping must not be null", code: 400})
		return
	}
	const player = await getPlayerFromInfo(false, token)
	if(player == null) {
		next({error: "Not authorized", code: 403})
		return
	}

	const game = getGameByPlayer(player);
	if (game == null) {
		next({error: "Not in a game", code: 400})
		return
	}

	game.setTyping(player, isTyping);
	res.send({status: "success"});
})


// setTyping
export default router;

