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
