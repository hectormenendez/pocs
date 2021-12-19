module.exports = {
    plugins: ["prettier-plugin-svelte"],
    printWidth: 100, // breaks line to maintain code's readability
    useTabs: false, // use spaces for indentation
    tabWidth: 4, // use 4 spaces for indentation
    semi: true, // appends semicolons to every line
    singleQuote: false, // use double quotes for everything (jsx / js)
    trailingComma: "all", // append trailing comma according to ES5 rules
    bracketSpacing: true, // Enforce spacing on bracketed statements
    arrowParens: "always", // Enforce always using parens on arrow functions
    svelteSortOrder: "options-scripts-markup-styles",
    svelteStrictMode: false,
    svelteBracketNewLine: true,
    svelteIndentScriptAndStyle: true,
};
