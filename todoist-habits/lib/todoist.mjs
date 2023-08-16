import { v8 } from "todoist"
import { TokenGet } from "./token.mjs";
import { ErrorThrow } from "./error.mjs"

export const TODOIST_ENDPOINT = "https://api.todoist.com/sync/v8";

export async function TodoistGet() {
    try {
        const todoist = v8(TokenGet());
        await todoist.sync();
        return todoist;
    } catch ({ message }) {
        ErrorThrow({ message, name: "TodoistError", hasStack: process.env.DEBUG });
    }
}