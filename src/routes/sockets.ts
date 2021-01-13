import * as WebSocket from "ws";
import { getPlayerFromInfo } from "../util/app";
import { games, getGameByPlayer } from "../game/GameManager";
import Game from "../game/Game";
import Player from "../game/Player";
import { server } from "../index";

const websocketServer = new WebSocket.Server({server});

export interface ExtWebSocket extends WebSocket {
	isAlive: boolean;
}

websocketServer.on("connection", (ws: WebSocket) => {
	const extWs = ws as ExtWebSocket;
	ws.send(JSON.stringify({type: "greeting", msg: "Hi there!"}))
	console.log("new conn")
	extWs.isAlive = true;

	ws.on('pong', () => {
		extWs.isAlive = true;
	});

	ws.on("message", async (msg: string) => {
		const content = JSON.parse(msg);
		const sender = await getPlayerFromInfo(false, content.token);

		console.log(content.msg + " from " + (sender ? sender.username : undefined));

		if (sender != null && sender.websocket != null) {
			sender.websocket.isAlive = true;
		}

		if(content.type != null && content.type === "register" && content.token != null) {
			const p = await getPlayerFromInfo(false, content.token);
			if (p != null) {
				p.websocket = extWs;
				console.log("Assigned " + p.username + "'s websocket!");

				const current_game = getGameByPlayer(p)
				if (current_game != null) {
					p.websocket.send(JSON.stringify(current_game.serializeGameInfo(p)))
				}
			} else {
				console.log("Couldn't find any player with the given token.")
			}
		}
	})

	ws.on('error', (err: Error) => {
		console.warn(`Client disconnected - reason: ${err}`);
	})
})

setInterval(() => {
	// Pinging every player
	games.map((game: Game) => game.players.map((player: Player) => {
		// console.log("ping", player.username)
		if (player.websocket != null) {
			// if (!player.websocket.isAlive) return ws.terminate();
			player.websocket.isAlive = false;
			player.websocket.ping(null, undefined);
		} else {
			console.log(player.websocket);
			console.log(player.username, "has yet to register their websocket.");
		}
	}))

}, 10000);
