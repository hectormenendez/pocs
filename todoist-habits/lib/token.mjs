import { ErrorThrow } from "./error.mjs";

export function TokenGet() {
    const { API_KEY } = process.env;
    if (!API_KEY) return ErrorThrow({
        message: "Missing API_KEY",
        name: "test",
        hasStack: process.env.DEBUG,
    });
    return API_KEY;
}