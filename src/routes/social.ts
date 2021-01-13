import express, { NextFunction, Request, Response } from "express";
import { getPlayerFromInfo } from "../util/app";

const router = express.Router();

router.post('/social/getUserInfo', async (request: Request, response: Response, next: NextFunction) => {
	const userID = request.body.userID;

	const result = await getPlayerFromInfo(false, undefined, undefined, userID);
	if (result != null) {
		delete result.websocket
		delete result.email
		response.send({status: "success", player: result})
	} else {
		next({code: 404, error: "Couldn't find player"})

	}
});


export default router;

