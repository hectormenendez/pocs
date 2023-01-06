import type { Context } from "x/oak/mod.ts";

export const UUID = "response-header-time";

export const DEPENDENCIES = [];

export const NAME_RESPONSE_HEADER_TIME = "X-Response-Time";

/** After each request, calculate the response time and add it to headers */
export async function Handler<S extends State>(context: Context<S, S>, next: Next) {
    const { response } = context;
    const timeStart = Date.now();
    await next();
    const timeEnd = Date.now() - timeStart;
    response.headers.set(NAME_RESPONSE_HEADER_TIME, `${timeEnd}ms`);
}
