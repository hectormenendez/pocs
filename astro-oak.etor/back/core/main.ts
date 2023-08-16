import { Application, Router, hasFlash, FlashServer } from "x/oak/mod.ts";
import { Database } from "x/aloedb/mod.ts";

import * as HandlerCors from "./handler/001-cors.ts";
import * as HandlerResponseHeaderTime from "./handler/003-response-header-time.ts";
import * as HandlerResponseHeaderVersion from "./handler/002-response-header-version.ts";
import * as HandlerLogger from "./handler/004-logger.ts";

type User = {
    nameFirst: string;
    nameLast: string;
    email: string;
};

const db = new Database<User>("data/users.json");

const options = !hasFlash() ? undefined : { serverConstructor: FlashServer };
const app = new Application(options);

app.use(HandlerCors.Handler);
app.use(HandlerLogger.Handler);
app.use(HandlerResponseHeaderTime.Handler);
app.use(HandlerResponseHeaderVersion.Handler);

const router = new Router();

router.get("/", async (ctx) => {
    ctx.response.status = 200;
    if (!ctx.isUpgradable) {
        const users = await db.findMany();
        ctx.response.body = users;
    } else {
        const ws = ctx.upgrade();
        ws.addEventListener("open", () => console.log("open"));
        ws.addEventListener("close", () => console.log("close"));
        ws.addEventListener("message", () => console.log("message"));
        ws.addEventListener("error", () => console.log("error"));
    }
});

app.use(router.allowedMethods());
app.use(router.routes());

app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
        `Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`,
    );
});

await app.listen({ port: 8000, hostname: "0.0.0.0" });
