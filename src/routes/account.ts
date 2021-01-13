import express, { NextFunction, Request, Response } from "express";
import Player, {authenticate} from "../models/PlayerModel";
import bcrypt from 'bcrypt';
import { checkIfEmailExists, checkIfUsernameExists, emailValidationRegex, uuidv4 } from "../util/util";
import { cachePlayer, getPlayerFromInfo } from "../util/app";
import { getGameByPlayer } from "../game/GameManager";

const router = express.Router();

router.put('/auth/signup', async (request: Request, response: Response, next: NextFunction) => {
	const username = request.body.username;
	const email = request.body.email;
	const password = request.body.password;

	console.log(username, email, password);

	const userID = Math.round(Math.random() * 1000000000000);

	const userData = {
		email: request.body.email,
		username: request.body.username,
		password: request.body.password,
		userID: userID,
		isModerator: false
	}
	const usernameExists = await checkIfUsernameExists(username)
	const emailExists = await checkIfEmailExists(email)

	if (email == null || email.length <= 5 || !emailValidationRegex.test(email)) {
		next({code: 400, error: "The email address you entered is invalid."});
	} else if (username == null || username.length < 5) {
		next({code: 400, error: "Your username must be at least 5 characters long."});
	} else if (password == null || password.length < 6) {
		next({code: 400, error: "Your password must be at least 6 characters long."});
	}

	if (!usernameExists && !emailExists) {
		await Player.create(userData, function(error: any, user: any) {
			if (error) {
				next(error);
			} else {
				response.send({status: "success", userID: userID})
			}
		});
	} else if(usernameExists) {
		next({code: 400, error: "Account with the entered username already exists"})
	} else {
		next({code: 400, error: "Account with the entered email already exists"})
	}


});

router.post('/auth/login', async (request: Request, response: Response, next: NextFunction) => {
	const username = request.body.username;
	const password = request.body.password;


	const token = await bcrypt.hash("test" + uuidv4() + (process.env.SECRET || undefined), 8);

	if (username == null || password == null) {
		console.log("oof", request.body)
		next({error: "Missing values", code: 400})
		return
	}
	const result = await authenticate(username, password);
	if(result != null) {
		console.log(result);
		console.log(result.userID);
		const player = await cachePlayer(result.userID, token)

		// Check if player already is in game!
		if (player != null) {
			const currentGame = getGameByPlayer(player)
			if (currentGame != null) {
				console.log(player.username, "is in game!");
				return response.cookie("token", token).send({status: "success", userID: result.userID, username: result.username, avatar: result.avatar, isModerator: result.isModerator, token: token, currentGame: currentGame.id})
			}
		}


		return response.cookie("token", token).send({status: "success", userID: result.userID, username: result.username, avatar: result.avatar, isModerator: result.isModerator, token: token, currentGame: undefined})
	} else {
		console.log("oof", username, password, result)
		next({error: "Couldn't authorize you", code: 403});
		return
	}
});

// Define the about route
router.get('/auth/logout', function(req: Request, res: Response) {
	res.clearCookie("token");
	res.status(204).send();
});


router.get('/auth/checkLoginStatus', async function(req: Request, res: Response) {
	const token = req.cookies.token;

	if(token == null) {
		res.status(401).send({status: "fail", error: "No token passed"})
		return
	}
	const user = await getPlayerFromInfo(false, token)
	if(user == null) {
		res.status(403).send({status: "fail", error: "Not authorized"})
		return
	}
	res.send({status: "success", isLoggedIn: true, token,  user: user})
})



export default router;

