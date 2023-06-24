import * as $PATH from "path";
import  * as $FS from "fs";

import { Halt } from "./utils/io.js";

const { npm_package_json } = process.env;

export const URL_SEP = "/";

export const URL_SEGMENT_BLOG = /** @type {const} */(`${URL_SEP}blog`);

/** All properties are obtained from the environment. */
export const ENV = /** @type {const} */ ({
    /** The port number where the server will listen to */
    PORT: Number(process.env.PORT),
});

export const ENTITY = /** @type {const} */ ({
    /** An Article is a piece of content written in a raw format */
    ARTICLE: "article",
    /** A component is a piece of UI that's independent. */
    COMPONENT: "component",
    /** A Handler is a piece of UI that's independent. */
    HANDLER: "handler",
    /** A Page is a Component which will be output as HTML */
    PAGE: "page",
    /** An Utility is an independent piece of code which serves a specific purpose. */
    UTIL: "util",
});

/** @typedef {keyof typeof ENTITY} ConfigEntity */

export const ENTITIES = (/** @type {[ConfigEntity]} */(Object.keys(ENTITY)));

export const MSG = {};
MSG.PATH_NOT_FOUND = /** @type {const} */ ("Path %does not exist.");

/** @type {Record<"ROOT" | "PACKAGE" | `${ConfigEntity}S`, string>} */
export const PATH = {};

/** Absolute path for the package.json of this project */
PATH.PACKAGE = String(npm_package_json);

/** Absolute path for the root of this project */
PATH.ROOT = $PATH.dirname(PATH.PACKAGE);

ENTITIES.forEach(key => {
    /** The plural equivalent for the entity */
    const KEY = /** @type {const} */(`${key}S`);
    const name = `${ENTITY[key]}s`;
    PATH[KEY] = $PATH.join(PATH.ROOT, name);
    if (!$FS.existsSync(PATH[KEY])) Halt(MSG.PATH_NOT_FOUND.replace("%", `${PATH[KEY]} `));
})