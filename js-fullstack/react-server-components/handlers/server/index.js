import $HTTP from "node:http";

import { v4 } from "uuid";
import { URL_SEGMENT, ENV } from "../../config.js";

import { Log } from "../../utils/io.js";
import { Router } from "../../components/Router.js";
import {
    SERVER_EVENT_EMITTER,
    SERVER_EVENT_NAME,
    ServerEventEmit
} from "./events.js";


/** @typedef {import("node:http").IncomingMessage} IncomingMessage */

/** @typedef {IncomingMessage & { url: URL; id: string; }} ServerRequest */

/** @typedef {import("node:http").ServerResponse & { event: typeof ServerEventEmit}} ServerResponse */

/**
 * @typedef {Object} ServerConnection
 * @property {ServerRequest} request
 * @property {ServerResponse} response
 */

export const Server = $HTTP.createServer();

export const ServerConnections = /** @type {Map<ServerRequest["id"], ServerConnection>}*/(new Map());

Server.on("error", ServerHandleError);
Server.on("listening", ServerHandleListening);
Server.on("request", ServerHandleRequest);

/** @param {Error} err */
function ServerHandleError(err) {
    console.error(err);
    ServerEventEmit(SERVER_EVENT_NAME.RENDER_STATUS, { status: 500 });
}


function ServerHandleListening() {
    console.log(`Listening on port: ${ENV.PORT}`);
}

SERVER_EVENT_EMITTER.addListener("test", (...args) => {
    console.log("here", args);
    process.exit(9);
})

/**
 * @param {ServerRequest} request
 * @param {ServerResponse} response
 */
async function ServerHandleRequest(request, response) {
    const id = v4();
    const url = new URL(request.url || "", `http://${request.headers.host}`);
    const log = /** @type {const} */({ type: "REQUEST", subject: id });
    const context = `${request.method} ${getURLPath(url)}`;

    Log({ ...log, context: `| INI | ${context}` });


    // Request's custom properties
    Object.defineProperty(request, "url", { value: url });
    Object.defineProperty(request, "id", { value: id });

    // Response's custom properties
    Object.defineProperty(response, "event", { value: ServerEventEmit.bind({ id }) });
    // hijack response.end to log when the response is sent.
    const _end = response.end;
    Object.defineProperty(response, "end", { value(...args) {
        // TODO: Save all connections to a database that can be lates queried.
        // ServerConnections.delete(id);
        _end.apply(this, args);
        Log({ ...log, context: `| END | ${context}` });
    }})

    // save this connection.
    ServerConnections.set(request.id, { request, response });

    // only accept get calls
    if (request.method !== "GET") {
        response.event(SERVER_EVENT_NAME.RENDER_STATUS, { status: 405 });
        return;
    }

    // static server
    const { pathname } = url;
    if (pathname.startsWith(URL_SEGMENT.ASSETS)) {
        // do not serve the index.
        if (pathname === URL_SEGMENT.ASSETS || pathname.endsWith("/")) {
            response.event(SERVER_EVENT_NAME.RENDER_STATUS, { status: 404 });
            return;
        }
        response.event(SERVER_EVENT_NAME.RENDER_STATIC);
        return;
    }

    // let the router handle the rest of the request.
    return await Router({ id });
}

/** @param {URL} url */
export function getURLPath(url) {
    return String(url)
        .replace(url.protocol, "")
        .replace(url.host, "")
        .slice(2);
}