module.exports = {
    root: true,

    env: {
        es2020: true,
    },

    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
    },

    overrides: [
        {
            files: ["**/*.ts"],
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint"],
            parserOptions: {
                warnOnUnsupportedTypeScriptVersion: true,
            },
            extends: ["plugin:@typescript-eslint/recommended"],
        },
        {
            files: ["**/*.astro"],
            parser: "astro-eslint-parser",
            plugins: ["@typescript-eslint"],
            parserOptions: {
                extraFileExtensions: [".astro"],
                warnOnUnsupportedTypeScriptVersion: true,
            },
            extends: [
                "plugin:@typescript-eslint/recommended",
                "plugin:astro/recommended",
                "plugin:astro/jsx-a11y-strict",
            ],
        },
    ],
};
