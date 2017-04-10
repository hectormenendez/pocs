const  Commons = require('./postcss.common');

module.exports = {
    plugins: Commons.map(({plugin, opt}) => plugin(opt))
};
