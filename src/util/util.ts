import { Document } from "mongoose";
import PlayerModel from "../models/PlayerModel";

export function shuffleArray(array_: any[]): any[] {
    const array = array_;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export const wait: (ms: number) => Promise<unknown> = (ms: number) => new Promise(r => setTimeout(r, ms));

export function uuidv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export async function checkIfUsernameExists(username: string): Promise<boolean> {
    const res = await PlayerModel.findOne({ username: username });
    return res != null;
}

export async function checkIfEmailExists(email: string): Promise<boolean> {
    const res = await PlayerModel.findOne({ email });
    return res != null;
}

export const emailValidationRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
