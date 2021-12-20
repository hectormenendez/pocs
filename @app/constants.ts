import $PATH from "path";

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const EXT = $PATH.extname(__filename);

export const PATH_MAIN = __dirname;
export const PATH_PRELOAD = $PATH.resolve(PATH_MAIN, `preload${EXT}`);
export const PATH_DIST = $PATH.resolve(PATH_MAIN, "..");

export const WIN_WIDTH = 800 as const;
export const WIN_HEIGHT = 600 as const;

// TODO: these should be set on .env
export const WWW_INDEX = "index.html" as const;
export const WWW_LOCATION = IS_PRODUCTION
    ? $PATH.join(PATH_DIST, WWW_INDEX)
    : `http://localhost:5000`;
