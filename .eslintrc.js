const { NODE_ENV } = process.env;

module.exports = {
    root: true,

    extends: ['@gik', 'prettier'],

    // Declare globals for browser
    env: {
        browser: true,
        es6: true,
        jest: false,
        commonjs: false,
        node: false,
    },

    parser: 'babel-eslint', // Included with @gik
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'script',
        ecmaFeatures: {
            jsx: false,
            generators: false,
        },
    },

    plugins: ['prettier'],

    rules: Object.assign(
        {
            // Use 4 spaces instead of AirBnb"s 2.
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1,
                    VariableDeclarator: 1,
                    outerIIFEBody: 1,
                    ArrayExpression: 1,
                    ObjectExpression: 1,
                    ImportDeclaration: 1,
                    flatTernaryExpressions: false,
                    ignoredNodes: ['JSXElement', 'JSXElement *'],
                    FunctionDeclaration: {
                        parameters: 1,
                        body: 1,
                    },
                    FunctionExpression: {
                        parameters: 1,
                        body: 1,
                    },
                    CallExpression: {
                        arguments: 1,
                    },
                },
            ],
            'arrow-parens': ['error', 'always'], // Always require parens on arrow functions
            // Maximum line-width
            'max-len': [
                'error',
                {
                    code: 90,
                    ignoreComments: false,
                    ignoreTrailingComments: false,
                    ignoreUrls: false,
                    ignoreStrings: false,
                    ignoreTemplateLiterals: false,
                    ignoreRegExpLiterals: false,
                },
            ],
            // never force the use of newlines on properties, just be consistent,
            'object-curly-newline': [
                'error',
                {
                    ObjectExpression: {
                        minProperties: undefined,
                        multiline: true,
                        consistent: true,
                    },
                    ObjectPattern: {
                        minProperties: undefined,
                        multiline: true,
                        consistent: true,
                    },
                    ImportDeclaration: {
                        minProperties: undefined,
                        multiline: true,
                        consistent: true,
                    },
                    ExportDeclaration: {
                        minProperties: undefined,
                        multiline: true,
                        consistent: true,
                    },
                },
            ],
        },
        NODE_ENV === 'production'
            ? {
                  // Production only
                  'no-console': 'error', // having console on production would be a fail.
                  'no-debugger': 'error', // error doesn't cut it. This would be apocalyptical.
                  'global-require': 'error', // if you're doing globals, you're failing in life.
              }
            : {
                  // Development only
                  'no-console': 'warn',
                  'no-debugger': 'warn',
                  'global-require': 'warn', // Used by hot-module-reloading
              },
    ),
};
