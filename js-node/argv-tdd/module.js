// Number calculation
exports.calculate = (...args) => args
    .reduce((acc, cur) => acc + cur);

// Answer conversion
exports.convert = answer => {
    if (!answer || answer.constructor !== String || !answer.length) return null;
    return answer
        .split(',')
        .map(number => parseInt(number, 10))
        .filter(number => number == Number(number));
}
