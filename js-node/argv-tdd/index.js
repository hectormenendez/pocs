const READLINE = require('readline');
const Module = require('./module');

const readline = READLINE.createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Introduce los números separados por comas: ', answer => {
    const numbers = Module.convert(answer);
    if (!numbers || !numbers.length)
        console.error('No se detectaron números');
    else
        console.log(`La suma es: ${Module.calculate(...numbers)}`);
    readline.close();
});
