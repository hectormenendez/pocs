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

const options = !hasFlash() ? undefined : { serverConstructor: FlashServer };
const app = new Application(options);

// Logger
app.use(async (ctx, next) => {
    await next();
    const rt = [
        ctx.response.headers.get("X-Response-Time"),
        ctx.response.headers.get("X-API-Version"),
    ].join(" ");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(async (ctx, next) => {
    const env = Deno.env.toObject();
    // NOTE: these two ony will be set if run win npm
    const version: string = env["npm_package_version"];
    ctx.response.headers.set("X-API-Version", version);
    await next();
});

app.use(router.allowedMethods());
app.use(router.routes());

app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
        `Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`,
    );
});

await app.listen({ port: 8000, hostname: "0.0.0.0" });
