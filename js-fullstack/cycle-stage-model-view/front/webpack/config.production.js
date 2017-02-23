const Extend  = require('deep-extend');
const Webpack = require('webpack');
const Extract = require('extract-text-webpack-plugin');

module.exports = config => Extend(config, { webpack: {

    // The output file
    output : {
        publicPath : '',
        filename   : 'bundle-[hash : 10].js',
    },

    // A full SourceMap is emitted as a separate file
    devtool: 'source-map',

    // Module loaders
    module: {
        loaders: [
            {// Stylesheets
                test    : /\.css$/,
                exclude : /node_modules/,
                use     : Extract.extract({
                    loader  : 'css-loader',
                    options : {
                        localIdentName : '[hash:base64:12]',
                        import         : true,
                        modules        : true,
                        minimize       : true,
                        sourceMap      : true,
                        importLoaders  : 1,
                    }
                })
            }
        ]
    },

    // Plugins
    plugins : [

        // Eliminate non-utilized code from output (it uses {modules:false on babelrc})
        new Webpack.optimize.UglifyJsPlugin({
            comments : false,
            mangle   : true,
            compress : { warnings : true }
        }),

        // extract styles into a file on the output folder
        new Extract('bundle-[contenthash:10].css'),
    ],
}});
