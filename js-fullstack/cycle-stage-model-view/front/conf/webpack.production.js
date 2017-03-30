const Webpack = require('webpack');

module.exports = conf => ({
    output:{
        // The name of on-demand loaded chunk files.
        chunkFilename: `bundle.[chunkhash]${conf.fs.ext}`,
        // Determines the name of each output bundle.
        filename: `bundle.[hash]${conf.fs.ext}`,
    }
})
