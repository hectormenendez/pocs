export function Halt(...args) {
    console.error(...args);
    process.exit(1);
}

/**
 * @typedef {Object} LogArg
 * @property {"EVENT" | "REQUEST" | "ROUTE"} type
 * @property {string} subject
 * @property {unknown} context?
 */

/** @type {number} */
let logLast = 0;

/**
 * @param  {LogArg} args
 */
export function Log({ type, subject, context }) {
    if (!logLast) logLast = performance.now();
    const date = new Date();
    const ellapsed = `+${(performance.now() - logLast).toFixed(3)}ms`;
    const timestamp = [
        // date
        [
            date.getFullYear(),
            pad(date.getMonth() + 1),
            pad(date.getDate()),
        ].join("-"),
        // time
        [
            pad(date.getHours()),
            pad(date.getMinutes()),
            pad(date.getSeconds()),
        ].join(":"),
    ].join(" ");
    logLast = performance.now();
    console.log(`${type}\t| ${ellapsed}\t| ${timestamp} | ${subject}`, context)
}

/** @param {number} n  */
function pad(n) {
    if (n < 10) return `0${n}`;
    return String(n);
}