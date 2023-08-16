import { oakCors } from "x/cors/mod.ts";

export const PRIORITY = 9;

export const DEPENDENCIES = [];

export const Plugin = oakCors({
    origin() {
        // TODO: re-enable CORS using URLs from config.
        return true;
        // const ip = IP.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // return new RegExp(`^.+(localhost|${ip}):[0-9]{2,}$`, "gi");
    },
    optionsSuccessStatus: 200,
});
