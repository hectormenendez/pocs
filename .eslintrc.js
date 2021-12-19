const $PATH = require("path");

const tsconfigRootDir = __dirname;
const project = $PATH.join(tsconfigRootDir, "tsconfig.json");

module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    plugins: ["@typescript-eslint", "svelte3"],
    env: {
        es6: true,
        browser: true,
    },
    settings: {
        "svelte3/typescript": () => require("typescript"),
        "svelte3/ignore-styles": () => true,
    },
    parser: "@typescript-eslint/parser",
    ignorePatterns: ["node_modules"],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        extraFileExtensions: [".svelte"],
        tsconfigRootDir,
        project,
    },
    overrides: [
        {
            files: ["*.svelte"],
            processor: "svelte3/svelte3",
        },
        {
            files: ["*.js"],
            extends: ["plugin:node/recommended"],
            rules: {
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/no-unsafe-argument": "off",
                "@typescript-eslint/no-unsafe-return": "off",
                "@typescript-eslint/no-unsafe-member-access": "off",
                "@typescript-eslint/no-unsafe-call": "off",
                "node/no-unpublished-require": "off",
                "node/no-unpublished-import": "off",
                "node/no-unsupported-features/es-syntax": "off",
            },
        },
    ],
};
