const Commons = require('./postcss.common');

module.exports = postcss => postcss(Commons.map(common => common.plugin));
