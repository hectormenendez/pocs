// NPM modules
import Webpack from 'webpack';
import Server from 'webpack-dev-server';
// Local
import ConfigDev from 'config/webpack.development';
import ConfigSrv from 'config/webpack.server';

// Equivalent to the --progress argument
ConfigDev.plugins.push(new Webpack.ProgressPlugin());

new Server(Webpack(ConfigDev), ConfigSrv).listen(
    ConfigSrv.port,
    ConfigSrv.host,
    () => console.log('\n\nDevServer running on: %s:%s\n', ConfigSrv.host, ConfigSrv.port)
);
