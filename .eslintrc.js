module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    plugins: ["@typescript-eslint", "svelte3"],
    parser: "@typescript-eslint/parser",
    env: {
        es6: true,
        browser: true,
    },
    settings: {
        "svelte3/typescript": () => require("typescript"),
    },
    ignorePatterns: ["node_modules"],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        extraFileExtensions: [".svelte"],
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
    },
    overrides: [
        {
            files: ["*.svelte"],
            processor: "svelte3/svelte3",
        },
        {
            files: ["*.ts"],
        }
    ],
};
