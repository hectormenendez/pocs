/* globals process */
/* eslint-disable import/no-dynamic-require */

import PATH from 'path';
import Webpack from 'webpack';
import WebpackServer from 'webpack-dev-server';

const Path = Object
    .keys(process.env)
    .filter(key => key.indexOf('npm_package_directories_') === 0)
    .reduce((path, key) => ({
        ...path,
        [key.replace('npm_package_directories_', '')]: PATH.resolve(process.env[key]),
    }), {
        root: process.cwd(),
    });

const conf = {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3333,
    path: Path,
};

const configWebpack = require(PATH.join(Path.etc, 'webpack')).default(conf);
const configServer = require(PATH.join(Path.etc, 'webpack-server')).default(conf);

const server = new WebpackServer(Webpack(configWebpack), configServer);

server.listen(conf.port, conf.host, () =>
    console.info('Listening on %s:%s', conf.host, conf.port),
);
