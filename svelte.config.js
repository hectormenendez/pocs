const Preprocess = require("svelte-preprocess");
const Config = require("./etc/preprocess-config");


module.exports = {
    dev: process.env.NODE_ENV !== "production",
    preprocess: Preprocess(Config),
};
