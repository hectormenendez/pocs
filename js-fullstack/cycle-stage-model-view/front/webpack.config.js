const Webpack = require('webpack');
const Common  = require('./webpack.common.js');

let entry = [Common.path.app];
if (!Common.isProduction) entry = entry.concat([
    'webpack/hot/dev-server',
    [
        'webpack-dev-server/client?',
        `${Common.server.schema}://`,
        `${Common.server.host}:${Common.server.port}`
    ].join('')
]);

// Both Production and Development
let plugins = [
    // Define variables so they are available
    new Webpack.DefinePlugin({
        Common: JSON.stringify(Common)
    })
];
// Production only
if (Common.isProduction) plugins = plugins.concat([
    // Eliminate non-utilized code from code (it uses {modules:false on babelrc})
    new Webpack.optimize.UglifyJsPlugin({
        comments : false,
        mangle   : true,
        compress : { warnings : true }
    })
]);
// Development only
else plugins = plugins.concat([
    new Webpack.HotModuleReplacementPlugin()
]);


module.exports = { entry, plugins,

    output: {
        path       : Common.path.out.root,
        publicPath : Common.path.out.rel,
        filename   : Common.path.out.bundle.base
    },

    module: {
        loaders: [{
            test    : /\.jsx?$/,
            loaders : ['babel-loader'],
            exclude : /node_modules/
        }],
    },

    devtool: 'source-map'

}

