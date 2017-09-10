// Node modules
import PATH from 'path';
// NPM modules
import Webpack from 'webpack';
import WebpackHtml from 'html-webpack-plugin';
// Local modules
import Path from 'util/path';
import Config from 'config/front';

export default {

    // The target environment for the compilation
    target: 'web',

    // The directory containing the entry files
    context: Path.source_front,

    // The application starting point
    entry: './index.js',

    // Instructions on how to output the bundle
    output: {
        // Use JSONP for loading on-demand chunks, by adding a script tag.
        crossOriginLoading: false,
        // Where should the bundle be put?
        path: Path.output,
        // The public URL for the root on the browser
        publicPath: ""
    },

    // Tell the module resolver how to behave
    resolve: {
        // If ommited, assume one of these extensions
        extensions: ['.js', '.jsx', '.json'],
        // if ommited, assume one of these paths
        modules: [ Path.source_front, Path.module ],
        // Make the app configuration available
        alias: {
            config: PATH.join(Path.config, 'front.json')
        }
    },

    // Some libraries import Node modules (pointless in the browser) make dummies for'em.
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        dgram: 'empty',
        child_process: 'empty'
    },

    // Transformations applied to each file-type imported on the app
    module: {

        rules: [

            // Html files.
            // These are the index files that will be put at the root of the output folder
            {
                test: /\.html$/,
                include: PATH.join(Path.source_front, 'index.html'),
                use: {
                    loader: 'html-loader',
                    options: {}
                }
            },

            {
                // js or jsx files
                test: /\.jsx?$/,
                include: Path.source_front,
                use: [
                    // Transpile with babel
                    {
                        loader: 'babel-loader',
                        options: {
                            // Use these presets for transpiling
                            presets: ['env', 'stage-0'],
                            // Cache the directory after first run, to save time.
                            cacheDirectory: true,
                            // Extra functionality
                            plugins: [
                                // Transform JSX whenever the Snabbdom module is included
                                [
                                    'transform-react-jsx',
                                    { pragma: 'Snabbdom.createElement' }
                                ]
                            ]
                        },
                    },
                    // Allow the use of conditional comments for special actions.
                    {
                        loader: 'ifdef-loader',
                        options: {
                            PRODUCTION: process.NODE_ENV === 'production'
                        }
                    }
                ]
            }

        ],
    },

    plugins: [

        // If any error is found on the compiling phase, don't emit a build.
        new Webpack.NoEmitOnErrorsPlugin(),

        // Outputs an html file based upon a template (specified on the html-loader)
        new WebpackHtml({
            // The title to use for the generated html
            title: Config.title,
            // The filename to use for the generated html
            filename: 'index.html',
            // Use this file as a template for the generated html
            template: PATH.join(Path.source_front, 'index.html'),
            // Inject generated resources on the head element of the html
            inject: 'head',
            // Append hashes to every generated resources to avoid caching them
            hash: process.env.NODE_ENV !== 'production',
            // Only emit the file when it hasn't changed between compiles
            cache: process.env.NODE_ENV !== 'production',
            // Write error details on the webpage
            showErrors: true
        })
    ]
}
