const Webpack = require('webpack');

module.exports = conf => ({

    // for chrome's "persist changes when saving"
    devtool: 'inline-source-map',

    // The points to enter the application
    entry: [
        'webpack-hot-middleware/client',
    ],

    output: {
        // Determines the name of each output bundle.
        filename: `bundle.[name]${conf.fs.ext}`,
        // THe name of on-demand loaded chunk files.
        chunkFilename: `chunk.[name]${conf.fs.ext}`,
        // Include comments in bundles with information about modules
        pathinfo: true,
    },

    // Transformations that are applied to given filetype
    module: {
        rules: [
            {
                test    : /\.css$/,
                include : [ conf.path('app') ],
                use     : [
                    // Inlines styles
                    {
                        loader  : 'style-loader',
                        options : {
                            // Only create one <style> tag
                            singleton: true
                        }
                    },
                    // Parse Css
                    {
                        loader  : 'css-loader',
                        options : {
                            /// @import and url() handling
                            import: true,
                            url   : true,
                            // Use local modules
                            modules : true,
                            localIdentName : '[path][name]__[local]',
                            // source-mapping and minification
                            sourceMap: true,
                            minimize : false,
                            // Allow that many loaders after the css-loader  for import
                            importLoaders: 1,
                            // Export classnames in camel case (stupid)
                            camelCase: false,
                        }
                    },
                    // Process CSS files with JS, it uses /.postcss.config.js
                    {
                        loader: 'postcss-loader'
                    }
                ]
            }
        ]
    },

    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.NoEmitOnErrorsPlugin(),
    ]
})
