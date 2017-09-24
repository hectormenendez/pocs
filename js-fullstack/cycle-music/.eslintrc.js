module.exports = {

    // Set aribnb rules as default (community standard as of 09/2017)
    extends: 'airbnb-base',

    // use eslint as a parser
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        allowImportExportEverywhere: false,
        codeFrame: true,
        // Enable  ES2017
        ecmaVersion: 8,
    },

    // Enable plugins for extra checks.
    plugins: [
        // Resolving module imports (instead of requires)
        'import',
    ],

    rules: {// 0 = off, 1 = warn, 2 = error

        // ------------------------------------------------------------------------ Errors

        'import/no-unresolved': 'error', // modules must be correctly resolved.
        'indent': ['error', 4], // 4 spaces for indent will be enforced.

        // ---------------------------------------------------------------------- Warnings

        'comma-dangle': 'warn', // trailing commas are desired for CVS
        'func-names': 'warn', // function names help debugging.
        'key-spacing': 'warn', // these allow to read much better properties.
        'spaced-comment': 'warn', // better comment readability
        'semi': 'warn', // Semicolons are a necessary evil for readability
        'space-before-blocks': 'warn', // another readability enhancement.
        'object-curly-spacing': 'warn',

        // ---------------------------------------------------------------------- Disabled

        'import/no-named-as-default': 'off', // Allow module vars to have any name
        'import/no-extraneous-dependencies': 'off', // Allow using dev-dependencies
        'import/extensions': 'off', // Don't enforce the use of extensions on imports
        'prefer-arrow-callback': 'off', // plain functions will do when not returning
        'space-before-function-paren': 'off', // This doesn't enhace readability
        'padded-blocks': 'off', // having some space sometimes helps readability
        'no-confusing-arrow': 'off', // what's confusing about a ternary? c'mon!
        'function-paren-newline': 'off', // sometimes its needed for readabiity.
        'no-plusplus': 'off', // Aww c'mon man, I like using it.
    }
}
