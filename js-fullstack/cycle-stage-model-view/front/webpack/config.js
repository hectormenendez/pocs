const PATH     = require('path');
const FS       = require('fs');
const NODE_ENV = process.env.NODE_ENV;

const Webpack = require('webpack');
const Html    = require('html-webpack-plugin');

const config = {

    env: !NODE_ENV? 'development' : String(NODE_ENV).toLowerCase(),

    // TODO: Since this is a development server, it should reside on 'development.js'
    server: {
        schema : 'http',
        host   : '0.0.0.0',
        port   : 8080
    },

    fs: {
        ext : PATH.extname(__filename),
    },

    path: function(route){
        const root = PATH.resolve('.');
        if (!route) return root;
        route = String(route).split('/').join(PATH.sep);
        return PATH.join(root, route);
    },

};

const webpack = config.webpack = {

    // The base directory for resolving entry points.
    context: config.path('src'),

    // Points to enter the application.
    entry: [
        config.path(`src/index${config.fs.ext}`)
    ],

    // Exposes Node vars.
    node: {
        __filename: true,
        __dirname : true,
    },

    // The output file
    output: {
        path: config.path('out'),
    },

    // Base module configuration
    module: {
        // Loaders (in order)
        loaders: [
            {// The base babel loader
                test    : /\.jsx?$/,
                loader  : 'babel-loader',
                exclude : /node_modules/
            }
        ]
    },

    plugins: [
        // Defines variables to be available globally
        new Webpack.DefinePlugin({}),
        // Uses a dinamic html based upon an existing template
        new Html({ template: `${config.path('src/index.html')}` })
    ]
}

module.exports = require([ '.', `config.${config.env}` ].join(PATH.sep))(config);
