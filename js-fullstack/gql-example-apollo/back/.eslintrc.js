const PATH = require('path');

module.exports = {
    extends: '@gik/node',
    settings: {
        'import/resolver': {
            node: {
                paths: [
                    PATH.join(__dirname, 'out'),
                    PATH.join(__dirname, 'src'),
                ]
            }
        }
    }
}
