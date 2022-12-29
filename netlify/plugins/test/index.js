import $PATH from "node:path";
import $FS from "node:fs";
import { fileURLToPath } from "node:url";

const CHARSET = "utf-8";

const PATH_SELF = $PATH.dirname(fileURLToPath(import.meta.url));
const PATH_ROOT = $PATH.resolve(PATH_SELF, "../../..");
const PATH_TOML = $PATH.join(PATH_ROOT, "netlify.toml");

const CONT_TOML = $FS.readFileSync(PATH_TOML, "utf8");

export function onPreBuild() {
    const content = CONT_TOML.replace("/api", "/apo");
    $FS.writeFileSync(PATH_TOML, content);
}
