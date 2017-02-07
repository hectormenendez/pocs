const Webpack = require('webpack');
const Extract = require('extract-text-webpack-plugin');
const Html    = require('html-webpack-plugin');
const Common  = require('./webpack.common.js');

let entry, plugins, loaders, publicPath, filename;

// Both Production and Development
entry   = [Common.path.app];
plugins = [
    // Define variables so they are available
    new Webpack.DefinePlugin({
        Common: JSON.stringify(Common)
    }),
    // Create an html file based upon a template
    new Html({
        template: `${Common.path.src}/index.html`
    })
];

loaders = [
    {
        test    : /\.jsx?$/,
        loaders : ['babel-loader'],
        exclude : /node_modules/
    },
]

// Production only
if (Common.isProduction) {
    publicPath = '';
    filename   = 'bundle-[hash:10].js';
    plugins = plugins.concat([
        // Eliminate non-utilized code from code (it uses {modules:false on babelrc})
        new Webpack.optimize.UglifyJsPlugin({
            comments : false,
            mangle   : true,
            compress : { warnings : true }
        }),
        // extract styles into a file on the output folder
        new Extract('bundle-[contenthash:10].css'),
    ]);

    loaders = loaders.concat([
        {
            test    : /\.css$/,
            exclude : /node_modules/,
            use     : Extract.extract({
                loader  : 'css-loader',
                options : {
                    localIdentName : '[hash:base64:12]',
                    import         : true,
                    modules        : true,
                    minimize       : true,
                    sourceMap      : false
                }
            })
        }
    ]);
}

// Development only
else {
    publicPath = Common.path.out.rel;
    filename   = 'bundle.js';
    entry = entry.concat([
        'webpack/hot/dev-server',
        [
            'webpack-dev-server/client?',
            `${Common.server.schema}://`,
            `${Common.server.host}:${Common.server.port}`
        ].join('')
    ]);

    plugins = plugins.concat([
        new Webpack.HotModuleReplacementPlugin()
    ]);

    loaders = loaders.concat([
        {
            test    : /\.css$/,
            exclude : /node_modules/,
            use     : [
                {
                    loader  : 'style-loader',
                    options : {}
                },
                {
                    loader: 'css-loader',
                    options: {
                        localIdentName : '[path][name]__[local]',
                        modules        : true,
                        importLoaders  : 1
                    }
                },
                {
                    loader: 'postcss-loader',
                }
            ]
        },
    ])
}

module.exports = { entry, plugins,

    output: {
        path       : Common.path.out.root,
        publicPath : publicPath,
        filename   : filename
    },

    module: {loaders},

    devtool: 'source-map',

    node : {
        __filename: true,
        __dirname : true
    }

}
