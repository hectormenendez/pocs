// NPM modules
import Webpack from 'webpack';
import Server from 'webpack-dev-server';
// Local modules
import ConfigDev from 'config/front.webpack.development';
import ConfigSrv from 'config/front.webpack.server';

// Equivalent to the --progress argument
ConfigDev.plugins.push(new Webpack.ProgressPlugin());

new Server(Webpack(ConfigDev), ConfigSrv)
    .listen(
        ConfigSrv.port,
        ConfigSrv.host,
        () => console.log(
            '\n\nDevServer running on: %s:%s\n',
            ConfigSrv.host,
            ConfigSrv.port,
        ),
    );
