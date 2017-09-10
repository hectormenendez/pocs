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
    hot: true,

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
        // Sort assets by a field
        assetsSort: "size",
        // Add information about cached (not built) modules
        cached: false,
        // Show cached assets (setting this to `false` only shows emitted files)
        cachedAssets: false,
        // Add children information
        children: true,
        // Add chunk information, setting this to `false` allows for a less verbose output
        chunks: true,
        // Add built modules information to chunk information
        chunkModules: false,
        // Add the origins of chunks and chunk merging info
        chunkOrigins: false,
        // Sort the chunks by a field
        chunksSort: "size",
        // Context directory for request shortening
        context: false,
        // `webpack --colors` equivalent
        colors: true,
        // Display the distance from the entry point for each module
        depth: true,
        // Add errors
        errors: true,
        // Add details to errors (like resolving log)
        errorDetails: true,
        // Exclude these from being included in stats
        exclude: /node_modules|webpack/,
        // Add the hash of the compilation
        hash: true,
        // Set the maximum number of modules to be shown
        maxModules: Infinity,
        // Add built modules information
        modules: true,
        // Sort the modules by a field
        modulesSort: "size",
        // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
        moduleTrace: true,
        // Show performance hint when file size exceeds `performance.maxAssetSize`
        performance: true,
        // Show the exports of the modules
        providedExports: true,
        // Add public path information
        publicPath: true,
        // Add information about the reasons why modules are included
        reasons: true,
        // Add timing information
        timings: true,
        // Show which exports of a module are used
        usedExports: true,
        // Add webpack version information
        version: true,
        // Add warnings
        warnings: true,
    }

};
