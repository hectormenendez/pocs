import type { Context } from "x/oak/mod.ts";

export const UUID = "response-header-version";

export const DEPENDENCIES = [];

/** Generate X-API-Version using npm_package_information */
export async function Handler<S extends State>(context: Context<S, S>, next: Next) {
    const { response } = context;
    // NOTE: it will be set if run usiung npm only
    const { npm_package_version } = Deno.env.toObject();
    response.headers.set("X-API-Version", npm_package_version);
    await next();
}
