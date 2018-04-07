const { injectBabelPlugin: RewireBabel } = require('react-app-rewired');
const RewireLess= require('react-app-rewire-less');

module.exports = function override(config, env) {

    // Only load Components that are actually being used.
    config = RewireBabel(['import', {
        style: true, // Use less instad of css
        libraryName: 'antd',
        libraryDirectory: 'es',
    }], config);

    // Overwrite less Variables for AntD themes.
    config = RewireLess.withLoaderOptions({
        modifyVars: {
            "@primary-color": "#1DA57A",
        },
    })(config, env);

    return config;
}