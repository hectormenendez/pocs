import $FS from "node:fs/promises";
import $PATH from "node:path";
import $STREAM from "node:stream/promises";
import $ZLIB from "node:zlib";
import $HTTP from "node:http";
import { createReadStream } from "node:fs";

import MimeTypes from "mime-types";

import { URL_SEP, URL_SEGMENT, ENV, PATH, MSG } from "../config.js";
import { Router } from "../components/Router.js";

import { JSX2HTML, JSXParse } from "./jsx.js";

/** @typedef {import("node:http").IncomingMessage & { url: URL  }} ServerRequest */

/** @typedef {import("node:http").ServerResponse} ServerResponse */

/** @typedef {{ id:string; request:ServerRequest, response:ServerResponse }} ServerEventContext */

/** @typedef {typeof SERVER_EVENT_NAME[keyof typeof SERVER_EVENT_NAME]} ServerEventName */

export const Server = $HTTP.createServer();
Server.on("listening", handleListen);
Server.on("request", handleRequest);


function handleListen() {
    console.log(`Listening on port: ${ENV.PORT}`);
}

export const SERVER_EVENT_PREFIX = "CUSTOM:";

export const SERVER_EVENT_NAME = /** @type {const} */({
    REDIRECT: "redirect",
    RENDER_STATUS: "renderStatus",
});

export const SERVER_EVENT = /** @type {const} */({

    /**
     * Redirects the current request to a new location.
     * @this {ServerEventContext}
     * @param {{ location?:string; status?: number }} args
     */
    [SERVER_EVENT_NAME.REDIRECT]({ location = URL_SEP, status = 302 }) {
        const { response } = this;
        response.writeHead(status, { Location: location });
        response.end();
    },

    /**
     * Renders a simple page containing the status code.
     * @this {ServerEventContext}
     * @param {{ status: number }} args
     */
    [SERVER_EVENT_NAME.RENDER_STATUS]({ status }) {
        const { response } = this;
        response.writeHead(status, { "Content-Type": "text/html" });
        // TODO: This should  use <Layout />;
        response.end(`<h1>${status}</h1>`);

    }
});

/**
 * @template {ServerEventName} N
 * @template {Parameters<typeof SERVER_EVENT[N]>[0]} A
 * @param {N} event
 * @param {...A} args
 */
export function ServerEmit(event, ...args) {
    if (!Server.listening) throw new Error(MSG.SERVER_NOT_LISTENING);
    if (!SERVER_EVENT[event]) return;
    Server.emit(`${SERVER_EVENT_PREFIX}${event}`, ...args);
}

/**
 * @param {ServerRequest} request
 * @param {ServerResponse} response
 */
async function handleRequest(request, response) {
    try {
        // register all custom events
        Object.entries(SERVER_EVENT).forEach(([id, handler]) => {
            Server.on(`${SERVER_EVENT_PREFIX}${id}`, handler.bind({ request, response }));
        });

        // Configure all custom properties on request and response
        const url = new URL(request.url || "", `http://${request.headers.host}`);
        Object.defineProperty(request, "url", { value: url });

        const isClientRequestingJSX = url.searchParams.has("jsx")
        url.searchParams.delete("jsx"); // keep url clean

        const { pathname } = url;

        // only accept get calls
        if (request.method !== "GET") {
            ServerEmit(SERVER_EVENT_NAME.RENDER_STATUS, { status: 405 });
            return;
        }

        // static server
        if (pathname.startsWith(URL_SEGMENT.ASSETS)) {
            handleStaticRequest(request, response);
            return;
        }


        // let the router handle the request.
        // when the response comes falsy, do nothing, it means the router will handle its own logic.
        const routerResponse = await Router({ url });
        if (!routerResponse) {
            response.end();
            return;
        }

        // is this a call from the client requesting JSX?
        if (isClientRequestingJSX) {
            const output = await JSXParse(routerResponse);
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(output, null, 2));
            return;
        }

        // this is a normal html response.
        const output = await JSX2HTML(routerResponse);
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(output);
    } catch (err) {
        console.error(err);
        ServerEmit(SERVER_EVENT_NAME.RENDER_STATUS, { status: 500 });
    }

}

/**
 * @param {ServerRequest} request
 * @param {ServerResponse} response
 */
async function handleStaticRequest(request, response) {
    const { pathname } = request.url;
    const segments = pathname.replace(URL_SEGMENT.ASSETS, "").split(URL_SEP).slice(1);
    // roots gets redirected back Home
    if (!segments.length) {
        ServerEmit(SERVER_EVENT_NAME.REDIRECT, { location: URL_SEP })
        return;
    }
    // Determine if segment has a corresponding asset.
    const segment = segments.shift();
    if (!segment)  {
        ServerEmit(SERVER_EVENT_NAME.RENDER_STATUS, { status: 404 });
        return;
    }
    try {
        const path = $PATH.join(PATH.ASSETS, segment);
        const stat = await $FS.stat(path);
        if (!stat.isFile()) throw null;
        const mime = String(MimeTypes.lookup(segment) ?? "text/plain");
        response.writeHead(200, {
            "Content-Type": mime,
            "Content-Encoding": "gzip",
        });
        // stream the file to the response.
        await $STREAM.pipeline(
            createReadStream(path),
            $ZLIB.createGzip(),
            response
        );
    } catch (err) {
        console.error(err);
        ServerEmit(SERVER_EVENT_NAME.RENDER_STATUS, { status: 500 });
    }
}