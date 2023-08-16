const Preprocess = require("svelte-preprocess");
const Config = require("./svelte-preprocess.config.json");

module.exports = {
    dev: process.env.NODE_ENV !== "production",
    preprocess: Preprocess(Config),
};
