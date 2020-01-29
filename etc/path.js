import PATH from "path";

export const SEP = PATH.SEP;
export const ROOT = __dirname;
export const EXT = ".";
export const EXT_CSS = `${EXT}css`;
export const EXT_JS = `${EXT}js`;
export const EXT_HTML = `${EXT}html`;
export const INDEX = "index";
export const INDEX_CSS = INDEX + EXT_CSS;
export const INDEX_JS = INDEX + EXT_JS;
export const INDEX_HTML = INDEX + EXT_HTML;
export const LEVEL_ROOT = { PUB: "pub", SRC: "src" };
export const LEVEL_SUB = { FRONT: "front", BACK: "back" };

export const Join = (...args) => PATH.join(...args.map((a) => String(a)));

export function Build(path, tree, subtree) {
    const result = new String(path);
    if (tree) {
        Object.defineProperties(
            result,
            Object.entries(tree).reduce(
                (acc, [key, val]) => ({
                    ...acc,
                    [key]: {
                        writable: false,
                        enumerable: true,
                        configurable: false,
                        value: Build(PATH.join(path, val), subtree),
                    },
                }),
                {},
            ),
        );
    }
    return result;
}

export const Path = Build(ROOT, LEVEL_ROOT, LEVEL_SUB);

export default Path;
