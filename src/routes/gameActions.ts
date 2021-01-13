import express, { NextFunction, Request, Response } from "express";
import { getPlayerFromInfo } from "../util/app";
import { forwardAction, getGameByPlayer } from "../game/GameManager";
import Player from "../game/Player";
import { PolicyType } from "../game/Enums";

const router = express.Router();


router.post('/game/nomination', async function(req: Request, res: Response, next: NextFunction) {

	let token = req.cookies.token;

	if(token == null && req.body.token != null) {
		token = req.body.token;
	}

	const nomineeID = req.body.nomineeID;


	const player = await getPlayerFromInfo(false, token)
	if(player == null) {
		res.status(403).send({status: "fail", error: "Not authorized"})
		return
	}

	if (nomineeID == null) {
		next( {error: "Missing values", code: 400})
		return;
	}


	const game = await getGameByPlayer(player);
	if (game == null) {
		next( {error: "You're not in any game", code: 400})
		return;

	}

	const nominee = await getPlayerFromInfo(false, undefined, undefined, Number(nomineeID))
	if (nominee == null) {
		next( {error: "Nominee not found", code: 400})
		return;

	}

	if (!game.players.some((p: Player) => p.userID === nominee.userID)) {
		next({error: "Nominee not in game", code: 400})
		return;

	}

	forwardAction(game, player, "nomination", {nominee: nominee})
	res.send({status: "success"})
});


router.post('/game/election', async function(req: Request, res: Response, next: NextFunction) {

	let token = req.cookies.token;

	if(token == null && req.body.token != null) {
		token = req.body.token;
	}

	const vote = req.body.vote;


	const player = await getPlayerFromInfo(false, token)
	if(player == null) {
		res.status(403).send({status: "fail", error: "Not authorized"})
		return
	}

	if (vote !== "null" && vote !== "ja" && vote !== "nein") {
		next( {error: "Vote must be either 'null', 'ja' or 'nein'", code: 400})
		return;
	}

	const game = getGameByPlayer(player);
	if (game == null) {
		next( {error: "You're not in any game", code: 400})
		return;
	}


	forwardAction(game, player, "election", {vote})
	res.send({status: "success"})
});

router.post('/game/legislative', async function(req: Request, res: Response, next: NextFunction) {

	let token = req.cookies.token;

	if(token == null && req.body.token != null) {
		token = req.body.token;
	}

	const discard = req.body.discard;


	const player = await getPlayerFromInfo(false, token)
	if(player == null) {
		res.status(403).send({status: "fail", error: "Not authorized"})
		return
	}

	const game = getGameByPlayer(player);
	if (game == null) {
		next( {error: "You're not in any game", code: 400})
		return;
	}

	if (discard !== PolicyType.Liberal && discard !== PolicyType.Fascist) {
		next( {error: "Policy to discard must be either " + PolicyType.Liberal + " or " + PolicyType.Fascist, code: 400})
		return;
	}


	forwardAction(game, player, "legislative", {discard})
	res.send({status: "success"})
});





export default router;
