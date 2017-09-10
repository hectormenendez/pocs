// Local modules
import Path from 'util/path';

export default {

    // Don't show logs for the compilation on the browser
    clientLogLevel: 'none',

    // should the served content be compressed?
    compress: false,

    // serve rcontent from this directory
    contentBase: Path.source_front,

    // Serve index.html instead of 404 responses
    historyApiFallback: true,

    // Necessary to allow the server to be accessible externally
    host: '0.0.0.0',

    // Enable Hot Module Replacement
    hot: false,

    // Enable https support?
    https: false,

    // true: show notifications on the browser, false: iframe mode.
    inline: true,

    // Only compile the bundle when it gets requested
    lazy: false,

    // Open the browser automatically
    open: false,

    // Show message on screen
    overlay: { warnings:false, errors: true },

    // The port where to serve
    port: process.env.PORT || 9000,

    // Watch the files located on contentBase
    watchContentBase: true,

    stats: {

        // Add asset Information
        assets: true,

        // Add information about cached (not built) modules
        cached: true,

        // Show cached assets (setting this to `false` only shows emitted files)
        cachedAssets: true,

        // Add children information
        children: true,

        // Add chunk information, setting this to `false` allows for a less verbose output
        chunks: true,

        // `webpack --colors` equivalent
        colors: true,

        // Display the distance from the entry point for each module
        depth: false,

        // Add errors
        errors: true,

        // Add details to errors (like resolving log)
        errorDetails: true,

        // Add the hash of the compilation
        hash: true,

        // Show performance hint when file size exceeds `performance.maxAssetSize`
        performance: true,

        // Add public path information
        publicPath: true,

        // Add information about the reasons why modules are included
        reasons: true,

        // Add timing information
        timings: true,

        // Add webpack version information
        version: true,

        // Add warnings
        warnings: true,
    }

};
