import $EVENTS from "node:events";

import $FS from "node:fs/promises";
import $PATH from "node:path";
import $STREAM from "node:stream/promises";
import $ZLIB from "node:zlib";
import { createReadStream } from "node:fs";

import MimeTypes from "mime-types";

import { URL_SEP, URL_SEGMENT, PATH, MSG } from "../../config.js";
import { Log } from "../../utils/io.js";

import { Server, ServerConnections } from "./index.js";

/**
 * @typedef {Object} ServerEventContext
 * @property {string} id
 * @property {import("./index.js").ServerRequest} request
 * @property {import("./index.js").ServerResponse} response
 */

/**
 * @typedef {typeof SERVER_EVENT_NAME[keyof typeof SERVER_EVENT_NAME]} ServerEventName
 */

export const SERVER_EVENT_EMITTER = new $EVENTS();

export const SERVER_EVENT_PREFIX = "CUSTOM:";

/** @typedef {import("../../utils/io.js").LogArg} LogArg */

export const SERVER_EVENT_NAME = /** @type {const} */({
    REDIRECT: "redirect",
    RENDER_STATUS: "renderStatus",
    RENDER_STATIC: "renderStatic",
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

    },

    /**
     * Renders a static file from the assets folder.
     * @this {ServerEventContext}
     */
    async [SERVER_EVENT_NAME.RENDER_STATIC]() {
        const { request, response } = this;
        const { pathname } = request.url;
        const segments = pathname.replace(URL_SEGMENT.ASSETS, "").split(URL_SEP).slice(1);
        // roots gets redirected back Home
        if (!segments.length) {
            ServerEventEmit(SERVER_EVENT_NAME.REDIRECT, { location: URL_SEP })
            return;
        }
        // Determine if segment has a corresponding asset.
        const segment = segments.shift();
        if (!segment)  {
            ServerEventEmit(SERVER_EVENT_NAME.RENDER_STATUS, { status: 404 });
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
            ServerEventEmit(SERVER_EVENT_NAME.RENDER_STATUS, { status: 500 });
        }

    },
});

/**
 * @note This is an internal method, devs should use `response.event()`.
 * @template {ServerEventName} N
 * @template {Parameters<typeof SERVER_EVENT[N]>[0]} A
 * @param {N} eventName
 * @param {...A} args
 */
export function ServerEventEmit(eventName, ...args) {
    const { id } = this;
    const connection = ServerConnections.get(id);
    if (!connection) throw new Error("The connection is invalid.");
    if (!Server.listening) throw new Error("The server is not listening.");
    if (!SERVER_EVENT[eventName]) throw new Error("The event is not valid.");
    const log = /** @type {const} */({ type: "EVENT", context: args });
    Log({ ...log, subject: `${id} | INI | ${eventName}`});
    const res = SERVER_EVENT[eventName].apply(connection, args);
    Log({ ...log, subject: `${id} | END | ${eventName}`});
    return res;
}
