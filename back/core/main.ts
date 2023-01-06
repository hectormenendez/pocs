import { Application, Router, hasFlash, FlashServer } from "x/oak/mod.ts";
import { Database } from "x/aloedb/mod.ts";

import * as LibResponseHeaderVersion from "./lib/response-header-version.ts";
import * as LibResponseHeaderTime from "./lib/response-header-time.ts";
import * as LibLogger from "./lib/logger.ts";

type User = {
    nameFirst: string;
    nameLast: string;
    email: string;
};

const db = new Database<User>("data/users.json");

const options = !hasFlash() ? undefined : { serverConstructor: FlashServer };
const app = new Application(options);

app.use(LibLogger.Handler);
app.use(LibResponseHeaderTime.Handler);
app.use(LibResponseHeaderVersion.Handler);

const router = new Router();

router.get("/", async (ctx) => {
    const users = await db.findMany();
    ctx.response.body = users;
});

router.get("/message", (ctx) => {
    if (!ctx.isUpgradable) {
        ctx.response.status = 501;
        return;
    }
    const ws = ctx.upgrade();
    ws.addEventListener("open", () => console.log("open"));
    ws.addEventListener("close", () => console.log("close"));
    ws.addEventListener("message", () => console.log("message"));
    ws.addEventListener("error", () => console.log("error"));
    ctx.response.status = 200;
});

app.use(router.allowedMethods());
app.use(router.routes());

app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
        `Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`,
    );
});

await app.listen({ port: 8000, hostname: "0.0.0.0" });
