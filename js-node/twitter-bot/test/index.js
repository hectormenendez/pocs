'use strict';

const App = require('../src/index');

describe('The main script', function(){

	it('should return 1', function(){

		expect(App()).to.be.equal(1);
	});
});