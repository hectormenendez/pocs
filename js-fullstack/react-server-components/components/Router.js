import { SERVER_EVENT_NAME } from "../handlers/server/events.js";
import { URL_SEP } from "../config.js";
import { JSX2HTML, JSXParse } from "../handlers/jsx.js";
import { ServerConnections } from "../handlers/server/index.js";
import { Home } from "../pages/Home.js";
import { Article } from "../pages/Article.js";

/**
 * @param {Object} props
 * @param {string} props.id - The request id.
 */
export async function Router({ id }) {

    const connection = ServerConnections.get(id);
    if (!connection) throw new Error("Connection not found.");

    const { response, request } = connection;

    const { url } = request;

    // determine if a jsx component is being requested
    const isClientRequestingJSX = url.searchParams.has("jsx")
    url.searchParams.delete("jsx"); // keep url clean

    const jsx = await (async () => {
        if (["/", "/index.html"].includes(url.pathname)) {
            return <Home />;
        }

        if (["/articles", "/articles/", "/articles/index.html"].includes(url.pathname)) {
            response.event(SERVER_EVENT_NAME.REDIRECT, { location: "/" });
            return undefined;
        }

        // if the path is an aricle let's determine if exists.
        if (url.pathname.startsWith("/articles/")) {
            return <Article slug={url.pathname.split(URL_SEP).pop() || "" } />
        }
    })();

    if (!jsx) return response.event(SERVER_EVENT_NAME.RENDER_STATUS, { status: 404 });

    if (isClientRequestingJSX) {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(await JSXParse(jsx), handleJSXSerialization));
    } else {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(await JSX2HTML(jsx))
    }
}

/**
 * Called on each entry of the object
 */
function handleJSXSerialization(key, value) {
    // symbols aren't serializable, let's send a proxy.
    if (value === Symbol.for("react.element")) return "$RE";
    // TODO: find out why this is necessary?
    if (typeof value === "string" && value.startsWith("$")) return `$${value}`;
    // every other case is handled normally
    return value;
}