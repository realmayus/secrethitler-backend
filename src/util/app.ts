import PlayerModel, { IUser } from "../models/PlayerModel";
import Player from "../game/Player";
import { Document } from "mongoose";


const userCache: {token: string | undefined, player: Player}[] = []

export async function cachePlayer(id: number, token: string | undefined): Promise<undefined | Player> {
	const x: Document | undefined = await PlayerModel.findOne({ userID: id })
	if (x == null) {
		return undefined
	}
	if (userCache.find(u => u.player.userID === id) != undefined) {
		userCache.filter(u => u.player.userID !== id);
	}
	const doc = <IUser> x;
	const player: Player = transformPlayerDocToPlayer(doc)
	userCache.push({token, player })
	return player
}

export function transformPlayerDocToPlayer(playerDoc: IUser): Player {
	return new Player(playerDoc.username, playerDoc.userID, playerDoc.avatar, playerDoc.matchesPlayed, playerDoc.timePlayed, playerDoc.matchesWon, playerDoc.matchesLost, playerDoc.email, playerDoc.isModerator)
}


export async function getPlayerFromInfo(confidential=false, token?: string, username?: string, id?: number, email?: string, lookUpInDBIfNotCached = false): Promise<Player | undefined> {
	let res
	if (token != null) {
		res = userCache.find(x => x.token === token);
	} else if (username != null) {
		res = userCache.find(x => x.player.username === username);
	} else if (id != null) {
		res = userCache.find(x => x.player.userID === id);
	} else if (email != null) {
		res = userCache.find(x => x.player.email === email);
	}

	if (res != null) {
		return res.player; //TODO confidential
	}
	if (lookUpInDBIfNotCached && id != null) {
		return cachePlayer(id, undefined);
	}

	return undefined
}