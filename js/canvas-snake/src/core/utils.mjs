/**
 * @param {number} len - The length for the hex string. (default: 8)
 * @returns {string} A randomize hex string
 */
export function Hex(len = 8) {
    const min = 16 ** (len -1);
    const max = (16 ** len) -1;
    let r = (Math.floor(Math.random() * (max - min + 1)) + min).toString(16);
    while (r.length < len) r += Hex(0);
    return r;
}

export function ToFloat(value, precision = 2) {
    return Number(value.toFixed(precision));
}

export function Assignator({ parent, params, required }) {
    const keys = Object.keys(params);
    const missing = required.filter((k) => !keys.includes(k));
    if (missing.length) {
        throw new Error(`Expecting { ${missing.join(', ')} } in params.`);
    }
    keys.forEach((key) => {
        parent[key] = params[key]; // eslint-disable-line no-param-reassign
    });
}



