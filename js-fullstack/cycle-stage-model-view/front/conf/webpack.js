const Html = require('html-webpack-plugin');
const ProgressBar = require('progress-bar-webpack-plugin');

module.exports = conf => ({

    // Defines the target environment for compilation.
    target: 'web',

    // The context is an absolute string to a directory containing the entry files
    context: conf.path('src'),

    // The points to enter the application
    // (Using an arrat so the environment specific config can concat new entry points)
    entry: [ `./index${conf.fs.ext}` ],

    // Instructions on where the output bundles should behave
    output: {

        // Only used when "target" is set to "web", wich uses JSONP for loading
        // on-demand chunks by adding script tags.
        crossOriginLoading: false,

        // The ouutput directory
        path: conf.path('out'),

        // Specifies the public URL of the output directory when referenced in a browser
        publicPath: "",
    },

    // Transformations that are applied on a file.
    module: {
        rules: [
            // Handle html files with their loader
            {
                test    : /\.html$/,
                loader  : 'html-loader',
                include : [ conf.path('src/index.html') ]
            },
            // Always apply babel transformations
            {
                test    : /\.jsx?$/,
                loader  : 'babel-loader',
                include : [ conf.path('src') ],
                query   : {
                    cacheDirectory: true
                }
            }
        ]
    },

    plugins:[
        new ProgressBar(),
        new Html({ template: `${conf.path('src/index.html')}` })
    ]

});
