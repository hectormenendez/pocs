const Webpack = require('webpack');
const Common  = require('./webpack.common.js');

console.info(Common);
process.exit(0);

module.exports = {

    entry: [
        Common.path.app,
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8080'
    ],

    output: {
        path       : Common.path.out,
        publicPath : PATH.sep + PATH.relative(Common.path.root, Common.path.out) + PATH.sep,
        filename   : PATH.basename(Common.path.bundle)
    },

    plugins: [
        new Webpack.HotModuleReplacementPlugin()
    ]

}

console.log(module.exports);
