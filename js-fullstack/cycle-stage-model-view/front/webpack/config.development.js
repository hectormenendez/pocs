const Extend  = require('deep-extend');
const Webpack = require('webpack');

module.exports = config => Extend(config, { webpack: {

    // The output file
    output: {
        publicPath : '/',
        filename   : 'bundle.js'
    },

    // Points to enter the application
    entry: [
        'webpack/hot/dev-server',
        [
            'webpack-dev-server/client?',
            `${config.server.schema}://`,
            `${config.server.host}:${config.server.port}`
        ].join('')
    ],

    // ach module is executed with eval() and a SourceMap is added as a DataUrl
    devtool: 'eval-source-map',

    module: {
        loaders: [
            {// Stylesheet
                test    : /\.css$/,
                exclude : /node_modules/,
                use     : [
                    {
                        loader  : 'style-loader',
                        options : {}
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            localIdentName : '[path][name]__[local]',
                            import         : true,
                            modules        : true,
                            minimize       : false,
                            sourceMap      : false,
                            importLoaders  : 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                    }
                ]
            },
        ]
    },

    // Plugins
    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
    ]
}});
