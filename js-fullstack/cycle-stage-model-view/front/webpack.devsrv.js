const Server  = require('webpack-dev-server');
const Webpack = require('webpack');

const Common = require('./webpack.common.js');
const Config = require('./webpack.config.js');

const webpack = Webpack(Config);
const server  = new Server(webpack, {
    filename   : Config.output.filename,
    publicPath : Config.output.publicPath,
    hot        : true,
    stats      : { color:true }
});

server.listen(Common.server.port, Common.server.host, function(){
    console.log(`Listening on: ${Common.server.host}:${Common.server.port}`);
});
