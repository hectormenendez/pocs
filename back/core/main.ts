import { Application, Router, hasFlash, FlashServer } from "x/oak/mod.ts";
import { Database } from "x/aloedb/mod.ts";

type User = {
    nameFirst: string;
    nameLast: string;
    email: string;
};

const db = new Database<User>("users.db");

const router = new Router();

router.get("/users", async (ctx) => {
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

app.use((ctx) => {
    ctx.response.body = "Hello World!";
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
        `Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`,
    );
});

await app.listen({ port: 8000, hostname: "0.0.0.0" });
