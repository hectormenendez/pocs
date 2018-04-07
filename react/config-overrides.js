const { injectBabelPlugin: RewireInject } = require('react-app-rewired');
const RewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {

    // Only load Components that are actually being used.
    config = RewireInject(['import', {
        style: true, // Use less instad of css
        libraryName: 'antd',
        libraryDirectory: 'es',
    }], config);

    // treat "~" as an alias for the src folder (root imports)
    config = RewireInject(['root-import', {
        rootPathPrefix: '~',
        rootPathSuffix: 'src',
    }], config);

    // Overwrite less Variables for AntD themes.
    config = RewireLess.withLoaderOptions({
        modifyVars: {
            // "@primary-color": "#1DA57A",
        },
    })(config, env);


    return config;
}