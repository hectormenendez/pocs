const AutoPrefixer = require("autoprefixer");
const CSSNano = require("cssnano");

module.exports = {
    plugins: [
        CSSNano({
            preset: "default",
            plugins: [AutoPrefixer],
        }),
    ],
};
