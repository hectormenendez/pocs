const ASSERT = require('assert');
const Module = require('./module');

describe('calculate', function() {
    it('should sum numbers', function() {
        [
            { answer: 6, args: [1, 2, 3] },                        // using integers
            { answer: 209, args: [0xCF, 2] },                      // using hexadecimals
            { answer: 9, args: [010, 01] },                        // using base10 numbers
            { answer: 3.5999999999999996, args: [1.1, 1.2, 1.3] }, // using floats
        ].forEach(({ answer, args })=> ASSERT.equal(answer, Module.calculate(...args)));
    });

    it('should concatenate characters', function(){
        [
            { answer: 'a2', args: ['a', 2] },
            { answer: '2a', args: [2, 'a'] },
            { answer: 'aa', args: ['a', 'a'] },
        ].forEach(({ answer, args })=> ASSERT.equal(answer, Module.calculate(...args)));
    });
});

describe('convert', function(){
    it('should return null when a string is not sent', function(){
        [
            '',
            new String(),
            new String(''),
            null,
            undefined,
            123,
            0xFF,
            [],
            true,
            010,
        ].forEach(test => ASSERT.equal(null, Module.convert(test)));
    });

    it('should return an array when string sent', function(){
        [
            new String('hola'),
            'test',
            'test, test',
            '1,2,4',
        ].forEach(test => ASSERT.equal(true, Array.isArray(Module.convert(test))));
    })
})
