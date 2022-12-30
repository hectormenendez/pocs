import * as $PATH from "https://deno.land/std@0.102.0/path/mod.ts";
// import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";
import type { Context } from "netlify:edge";

const PATH_SELF = $PATH.dirname($PATH.fromFileUrl(import.meta.url));

export default async function handler(req: Request, ctx: Context) {
    console.log("Processing request for", req.url);
    return new Response(PATH_SELF);
}
