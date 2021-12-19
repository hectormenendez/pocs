module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    plugins: ["svelte3", "@typescript-eslint"],
    parser: "@typescript-eslint/parser",
    env: {
        es6: true,
        browser: true,
    },
    settings: {
        "svelte3/typescript": require("typescript"),
    },
    ignorePatterns: ["node_modules"],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
        extraFileExtensions: [".svelte"],
    },
    overrides: [
        {
            files: ["*.svelte"],
            processor: "svelte3/svelte3",
        },
    ],
};
