/* globals process */

import PATH from 'path';
import Webpack from 'webpack';
import WebpackHtml from 'html-webpack-plugin';

export default conf => ({

    target: 'web',

    context: conf.path.src,

    devtool: 'cheap-module-source-map',

    entry: [
        `webpack-dev-server/client?http://${conf.host}:${conf.port}`,
        'webpack/hot/dev-server',
        'index.js',
    ],

    output: {
        crossOriginLoading: false,
        path: conf.path.out,
        publicPath: '',
        filename: 'bundle.[name].js',
        chunkFilename: 'bundle.chunk.[name].js',
        pathinfo: true,
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: ['src', 'node_modules'],
    },

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        dgram: 'empty',
        child_process: 'empty',
    },

    module: {
        rules: [

            {
                test: /\.html$/,
                include: PATH.join(conf.path.src, 'index.html'),
                use: {
                    loader: 'html-loader',
                    options: {},
                },
            },

            {
                test: /\.jsx?$/,
                include: [conf.path.src],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false, // don't use .babelrc it is used for "node"
                            presets: [
                                'react',
                                ['env', {
                                    targets: {
                                        browsers: ['last 2 versions', 'Safari >= 7'],
                                    },
                                }],
                                'stage-2',
                            ],
                            plugins: [
                                'inline-import', // for graphql files
                            ],
                        },
                    },
                    {
                        loader: 'eslint-loader',
                        options: {
                            failOnError: true,
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new WebpackHtml({
            filename: 'index.html',
            template: PATH.join(conf.path.src, 'index.html'),
            inject: 'body',
            hash: process.env.NODE_ENV !== 'production',
            cache: process.env.NODE_ENV !== 'production',
            showErrors: true,
        }),
        new Webpack.NamedModulesPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
    ],
});
