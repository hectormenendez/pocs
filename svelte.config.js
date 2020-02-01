const { TypeScript } = require("./etc/rollup.front");

module.exports = {
    dev: process.env.NODE_ENV !== "development",
    preprocess: TypeScript.Preprocess,
};

