const PATH = require('path');

module.exports = {
    extends: '@gik/react',
    settings: {
        'import/resolver': {
           webpack: {
                config: {
                    resolve: {
                        extensions: ['.js', '.jsx', '.json'],
                        modules: ['src', 'node_modules'],
                    }
                }
            }
        }
    }
}
