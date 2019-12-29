import Debug from 'debug'; // included by express

// Constructs a pseudo-class emulating "console" functionality.
export const Logger = (debug => ['log', 'debug', 'info', 'warn', 'error']
    .reduce((obj, key) => ({
        ...obj,
        [key]: function logger(...args) {
            const str = `[${key.toUpperCase()}] ${args.shift()}`;
            return debug.apply(debug, [str, ...args]);
        },
    }), {})
)(Debug('proxy'));

export default {
    Logger,
};
