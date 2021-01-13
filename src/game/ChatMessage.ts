import Player from "./Player";

export default class ChatMessage {

	id: string;
	text: string;
	timestamp: number;
	editedAt: undefined | number;
	author: Player;
	authorId: number;

	constructor(id: string, text: string, author: Player) {
		this.id = id;
		this.text = text;
		this.timestamp = Date.now();
		this.editedAt = undefined;
		this.author = author;
		this.authorId = author.userID;
	}

	edit(newText: string) {
		this.text = newText;
		this.editedAt = Date.now();
	}
}