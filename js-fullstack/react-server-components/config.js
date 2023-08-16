import * as $PATH from "node:path";
import  * as $FS from "node:fs";

import { Halt } from "./utils/io.js";

const { npm_package_json } = process.env;

export const URL_SEP = "/";

export const URL_SEGMENT = /** @type {const} */ ({
    ASSETS: "/assets",
    ARTICLES: "/articles",
})

/** All properties are obtained from the environment. */
export const ENV = /** @type {const} */ ({
    /** The port number where the server will listen to */
    PORT: Number(process.env.PORT),
});

export const KIND = /** @type {const} */ ({
    /** An Article is a piece of content written in a raw format. */
    ARTICLE: "article",
    /** A static resource which is fully static and publicly available.*/
    ASSET: "asset",
    /** A component is a piece of UI that's independent. */
    COMPONENT: "component",
    /** A Handler is a piece of UI that's independent. */
    HANDLER: "handler",
    /** A Page is a Component which will be output as HTML. */
    PAGE: "page",
    /** An Utility is an independent piece of code which serves a specific purpose. */
    UTIL: "util",
});

/** @typedef {keyof typeof KIND} KindKey */

export const KINDS = (/** @type {[KindKey]} */(Object.keys(KIND)));

export const MSG = {};
MSG.PATH_NOT_FOUND = /** @type {const} */ ("Path %does not exist.");
MSG.SERVER_NOT_LISTENING = /** @type {const} */("The server is not currently listening.");

/** @type {Record<"ROOT" | "PACKAGE" | `${KindKey}S`, string>} */
export const PATH = {};

/** Absolute path for the package.json of this project */
PATH.PACKAGE = String(npm_package_json);

/** Absolute path for the root of this project */
PATH.ROOT = $PATH.dirname(PATH.PACKAGE);

// Generates the paths for each kind.
KINDS.forEach(key => {
    /** The plural equivalent for the kind */
    const KEY = /** @type {const} */(`${key}S`);
    const name = `${KIND[key]}s`;
    PATH[KEY] = $PATH.join(PATH.ROOT, name);
    if (!$FS.existsSync(PATH[KEY])) Halt(MSG.PATH_NOT_FOUND.replace("%", `${PATH[KEY]} `));
})