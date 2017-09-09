// NPM Modules
import WebpackMerge from 'webpack-merge';
// Local modules
import Config from 'config/webpack';

export default WebpackMerge(Config, {
    development: true
});
