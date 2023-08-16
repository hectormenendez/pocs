const $PATH = require("path");

exports.PATH_ROOT = $PATH.resolve(__dirname, "..");
exports.PATH_DIST = $PATH.join(exports.PATH_ROOT, "dist");
