import type { Context } from "netlify:edge";

export default async function handler(req: Request, ctx: Context) {
    console.log("Processing request for", req.url);
    return new Response("Hello World");
}
