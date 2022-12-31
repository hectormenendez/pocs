import $FS from "node:fs";
import $PATH from "node:path";
import $HTTPS from "node:https";
import $ZLIB from "node:zlib";
import $URL from "node:url";
import $OS from "node:os";

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
    // Download zip file to tmp folder
    await new Promise((resolve, reject) => {
        const url = getURL();
        const writeZip = $FS.createWriteStream(fileDenoZip);
        log(`Downloading: ${url}`);
        $HTTPS.get(url, (res) => {
            res.pipe(writeZip);
            writeZip.on("error", (err) => {
                err.message = `Could not download: ${err.message}`;
                reject(err);
            });
            writeZip.on("finish", () => {
                writeZip.close();
                log(`Downloaded: ${fileDenoZip}`);
                resolve(undefined);
            });
        });
    });
    // Extract the zip to node_modules
    await new Promise((resolve, reject) => {
        const unzip = $ZLIB.createDeflate();
        const readZip = $FS.createReadStream(fileDenoZip);
        const writeBin = $FS.createWriteStream(fileDenoBin);
        readZip.pipe(unzip).pipe(writeBin);
        writeBin.on("error", (err) => {
            err.message = `Could not unzip: ${err.message}`;
            reject(err);
        });
        writeBin.on("close", () => {
            $FS.chmod(fileDenoBin, "751", (err) => {
                if (err) {
                    err.message = `Could not change permissions: ${err.message}`;
                    return reject(err);
                }
                log(`Unzipped: ${fileDenoBin}`);
                resolve(undefined);
            });
        });
    });
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
            target = `${OS_UNAME}-apple-darwin`;
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
