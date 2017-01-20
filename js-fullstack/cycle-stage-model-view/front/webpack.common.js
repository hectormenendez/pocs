
const PATH = require('path');
const Common = module.exports = {};

Common.path                 = {};
Common.path.root            = __dirname;
Common.path.ext             = PATH.extname(__filename);
Common.path.src             = PATH.join(Common.path.root, 'src');
Common.path.app             = PATH.join(Common.path.src, `app${Common.path.ext}`);
Common.path.out             = {};
Common.path.out.root        = PATH.join(Common.path.root, 'out');
Common.path.out.bundle      = {};
Common.path.out.bundle.root = PATH.join(Common.path.out.root, `bundle${Common.path.ext}`);
Common.path.out.bundle.base = PATH.basename(Common.path.out.bundle.root);
Common.path.out.rel         = [
    PATH.sep,
    PATH.relative(Common.path.root, Common.path.out.root),
    PATH.sep
].join('');
