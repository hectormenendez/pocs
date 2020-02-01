const { preprocess: TypeScriptPreprocess } = require("@pyoner/svelte-ts-preprocess")


module.exports = {
    dev: process.env.NODE_ENV !== "production",
    preprocess: TypeScriptPreprocess(),
};

