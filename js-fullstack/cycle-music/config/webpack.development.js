// NPM Modules
import Webpack from 'webpack';
import WebpackMerge from 'webpack-merge';
// Local modules
import Config from 'config/webpack';

export default WebpackMerge(Config, {

    // The style of source-mapping, this can greatly speed-up bundling.
    // This is not the fastest method, but produces the original source-code.
    devtool: 'eval-source-map',

    // Instructions on how to output the bundle (extending base config)
    output: {
        // Determines the name of the bundle.
        filename: 'bundle.[name].js',
        // Determines the name of the chunk files loaded on-demand.
        chunkFilename: 'bundle.chunk.[name].js',
        // Include a comment in each bundle with the path of their corresponfing source
        pathinfo: true,
    },

    plugins: [
        // When HMR is enabled, show the relative path of the module
        new Webpack.NamedModulesPlugin()
    ]
});
