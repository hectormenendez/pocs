// NPM modules
import WebpackMerge from 'webpack-merge';
import Config from 'config/webpack.development';

export default WebpackMerge(Config, {
    server: true
});
