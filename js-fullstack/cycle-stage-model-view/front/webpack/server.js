const Server  = require('webpack-dev-server');
const Webpack = require('webpack');

const {webpack} = require('./config');

const config = Webpack(webpack);
const server  = new Server(config, {
    filename   : webpack.output.filename,
    publicPath : webpack.output.publicPath,
    hot        : true,
    stats      : { color:true },
});

console.log(config)

// server.listen(Common.server.port, Common.server.host, function(){
//     console.log(`Listening on: ${Common.server.host}:${Common.server.port}`);
// });
//
// path.root            = __dirname;
// path.ext             = PATH.extname(__filename);
// path.src             = PATH.join(path.root, 'src');
// path.app             = PATH.join(path.src, `index${path.ext}`);
// path.out             = {};
// path.out.root        = PATH.join(path.root, 'out');
// path.out.rel         = PATH.sep + PATH.relative(path.root, path.out.root) + PATH.sep;
// path.out.bundle      = {};
// path.out.bundle.root = PATH.join(path.out.root, `bundle${path.ext}`);
// path.out.bundle.base = PATH.basename(path.out.bundle.root);
