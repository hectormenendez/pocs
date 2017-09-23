const {NODE_ENV} = process.env;
const EsLint = module.exports = {};

// Use base configuration
EsLint.extends = '../../.eslintrc.js';

// This is code for a browser.
EsLint.env = {
    browser: true,
    node: false,
};

// Add eslint-plugins-jsx package for JSX validation
EsLint.plugins = ['jsx'];

// Specify parser behaviour
EsLint.parserOptions = {
    ecmaFeatures: {
        // Don't freak out when using JSX
        jsx: true,
    },
};

EsLint.settings = {
    // Let the resolver know the webpack conf, so it adapts.
    'import/resolver': {
        webpack: {
            config: 'source/config/front.webpack.eslint.js'
        },
    },
};

// Allow these globals to be used
EsLint.globals = Object.assign(
    // Common
    {},
    // Production only
    NODE_ENV === 'production' ? {} :
    // Development only
    {
        module: null, // used by hot-module-reloading
        require: null, // used by hot-module-reloading
    }
);

// Add new rules specific for frontend.
EsLint.rules = Object.assign(
    // Common
    {
        // ------------------------------------------------------------------------- Error
        'no-unused-vars': ['error', { // Disallow declaring something is not used.
            varsIgnorePattern: 'Snabbdom', // This is used by wabpack for JSX
        }],
        'jsx/uses-factory': ['error', { pragma: 'Snabbdom' }],
        'jsx/mark-used-vars': 'error',
        'jsx/no-undef': 'error',
        // ----------------------------------------------------------------------- Warning
        'spaced-comment': ['warn', 'always', { markers: ['/'] }], // for ifdef
        // ---------------------------------------------------------------------- Disabled
        'jsx/factory-in-scope': ['off', { pragma: 'Snabbdom' }],
    },
    // Production only
    NODE_ENV === 'production' ?
    {
        'no-console': 'error', // having console on production would be a fail.
        'no-debugger': 'error', // error doesn't cut it. This would be apocalyptical.
    } :
    // Development only
    {
        'no-console': 'warn',
        'no-debugger': 'warn',
        'global-require': 'off', // Used by hot-module-reloading
    },
);
