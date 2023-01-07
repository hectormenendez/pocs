import type { Context } from "x/oak/mod.ts";

import { NAME_RESPONSE_HEADER_TIME } from "./response-header-time.ts";

export const UUID = "logger";

export const DEPENDENCIES = [
    // Allows outputting the amount of time it took to process current response.
    "response-header-time",
];

/** Log the respons*/
export async function Handler<S extends State>(context: Context<S, S>, next: Next) {
    await next();
    const {
        request: { method, headers: headersRequest },
        response: { headers: headersResponse, status },
    } = context;
    const url = new URL(context.request.url);
    const time = headersResponse.get(NAME_RESPONSE_HEADER_TIME);
    const agent = headersRequest.get("User-Agent");
    console.log(
        `[MAIN] ${method.toUpperCase()} ${url.pathname}${
            url.search ? "/" + url.search : ""
        } ${status} ${time} - ${agent}`,
    );
}
