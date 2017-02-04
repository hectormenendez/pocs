const Assert = require('assert');
const App    = require('../../../src/app');

describe('users service', function() {
    it('registered the users service', () => {
        Assert.ok(App.service('users'));
    });
});
