const PATH = require('path');

const Common = module.exports = {};

Common.isProduction = process.env.NODE_ENV === 'production';

const server = Common.server = {};
server.schema = 'http';
server.host   = '0.0.0.0';
server.port   = 8080;

const path           = Common.path = {};
path.root            = __dirname;
path.ext             = PATH.extname(__filename);
path.src             = PATH.join(path.root, 'src');
path.app             = PATH.join(path.src, `index${path.ext}`);
path.out             = {};
path.out.root        = PATH.join(path.root, 'out');
path.out.rel         = PATH.sep + PATH.relative(path.root, path.out.root) + PATH.sep;
path.out.bundle      = {};
path.out.bundle.root = PATH.join(path.out.root, `bundle${path.ext}`);
path.out.bundle.base = PATH.basename(path.out.bundle.root);
