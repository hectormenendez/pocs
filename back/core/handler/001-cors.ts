import { oakCors } from "x/cors/mod.ts";

export const UUID = "cors";

export const DEPENDENCIES = [];

export const Handler = oakCors({
    origin() {
        // TODO: re-enable CORS using URLs from config.
        return true;
        // const ip = IP.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // return new RegExp(`^.+(localhost|${ip}):[0-9]{2,}$`, "gi");
    },
    optionsSuccessStatus: 200,
});
