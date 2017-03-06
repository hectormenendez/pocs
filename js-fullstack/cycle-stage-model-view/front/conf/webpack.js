const Html = require('html-webpack-plugin');

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
        // The name of on-demand loaded chunk files.
        chunkFilename: `bundle.[chunkhash]${conf.fs.ext}`,

        // Only used when "target" is set to "web", wich uses JSONP for loading
        // on-demand chunks by adding script tags.
        crossOriginLoading: false,

        // Determines the name of each output bundle.
        filename: `bundle.[hash]${conf.fs.ext}`,

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
        new Html({ template: `${conf.path('src/index.html')}` })
    ]

});
