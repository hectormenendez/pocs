import $ from 'xstream';
import Webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';

import Config from './config';

export default function Front(server){
    const server$ = $.of(server);
    const config$ = Config(__dirname);
    return $
        .combine(server$, config$)
        .map(([server, config]) => {
            const webpack = Webpack(config.webpack);
            // Configure Middleware
            server.use(WebpackDevMiddleware(webpack, {
                noInfo: false,
                stats: { colors:true },
                publicPath: config.webpack.output.publicPath,
                filename: config.webpack.output.filename,
            }));
            server.use(WebpackHotMiddleware(webpack));
            return server;
        });
}
