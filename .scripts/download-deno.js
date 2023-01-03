import $FS from "node:fs";
import $PATH from "node:path";
import $HTTPS from "node:https";
import $HTTP from "node:http";
import $URL from "node:url";
import $OS from "node:os";
import ExtractZip from "extract-zip";

const PATH_SELF = $PATH.dirname($URL.fileURLToPath(import.meta.url));
const PATH_ROOT = $PATH.resolve(PATH_SELF, "..");
const PATH_TMP = $OS.tmpdir();
const PATH_BIN = $PATH.join(PATH_ROOT, "node_modules", ".bin");

const fileDenoZip = $PATH.join(PATH_TMP, "deno.zip");
const fileDenoBin = $PATH.join(PATH_BIN, "deno");

const OS_TYPE = $OS.type();
const OS_UNAME = $OS.arch();
const { npm_package_config_deno_version: CONF_DENO_VERSION } = process.env;

if (!CONF_DENO_VERSION) {
    console.error("You must specify a Deno version on package.json");
    process.exit(1);
}

(async () => {
    try {
        await handleDownload(getURL(), fileDenoZip);
        log(`Extracting: ${PATH_BIN}`);
        await ExtractZip(fileDenoZip, { dir: PATH_BIN, defaultFileMode: 0o751 });
        log("Done");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
})();

function log(message) {
    console.log(`[DENO] ${message}`);
}

function getURL() {
    let target = "";
    if (OS_TYPE === "Windows_NT") {
        target = "x86_64-pc-windows-msvc";
    } else {
        if (OS_TYPE === "Darwin") {
            const prefix = OS_UNAME === "x64" ? "x86_64" : "aarch64";
            target = `${prefix}-apple-darwin`;
        } else {
            // assuming linux
            if (OS_UNAME === "aarch64") {
                console.error(
                    [
                        "Error: Official Deno builds for Linux aarch64 are not available.",
                        "(https://github.com/denoland/deno/issues/1846)",
                    ].join(" "),
                );
                process.exit(1);
            }
            target = "x86_64-unknown-linux-gnu";
        }
    }
    return [
        "https://github.com/denoland/deno/releases/download",
        `v${CONF_DENO_VERSION}/deno-${target}.zip`,
    ].join("/");
}

/**
 * @param error {Error}
 * @param reject {null | ((message?: any) => void)}
 */
function handleRejection(path, reject = null, error = new Error("UNKNOWN")) {
    $FS.unlink(path, () => {
        if (!reject) throw error;
        reject(error);
    });
}

/**
 * @param url {string} - From where?
 * @param path {string} - path to download!
 */
function handleDownload(url, path) {
    const HANDLER_REQUEST = { "https:": $HTTPS, "http:": $HTTP };
    log(`Requesting: ${url}`);
    return new Promise((resolve, reject) => {
        /** @type {typeof handleRejection} */
        const handlerRejection = handleRejection.bind(handleRejection, path, reject);

        const { protocol } = new URL(url);
        /** @type {(typeof $HTTP) | (typeof $HTTPS)} */
        const handlerRequest = HANDLER_REQUEST[protocol];
        if (!handlerRequest) {
            const message = `Invalid protocol "${protocol}", expected: ${Object.keys(
                HANDLER_REQUEST,
            ).join(", ")}`;
            return handlerRejection(new Error(message));
        }
        const request = handlerRequest.get(url, (response) => {
            const { statusCode, headers } = response;
            if (!statusCode)
                return handlerRejection(new Error(`Invalid statusCode: ${statusCode}`));
            // handle errors
            if (statusCode >= 400) return handlerRejection(new Error(`STATUS = ${statusCode}`));
            // handle redirections
            if (statusCode === 302 || statusCode === 301) {
                if (!headers.location)
                    return handlerRejection(new Error("No location provided for redirect"));
                log("Redirect detected.");
                return handleDownload(headers.location, path)
                    .then((x) => resolve(x))
                    .catch(handlerRejection);
            }

            const stream = $FS.createWriteStream(path);
            stream.on("error", handlerRejection);
            stream.on("finish", () => {
                stream.close();
                log(`Downloaded: ${path}`);
                resolve(undefined);
            });

            response.pipe(stream).on("data", (...args) => console.log("drain!", ...args));
        });
        request.on("error", handlerRejection);
    });
}
