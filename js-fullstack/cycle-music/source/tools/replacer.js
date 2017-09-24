/**
 * An object subject to replacement using Replaecer. It can be multi-level.
 * @typedef {Object} ReplaceSource
 */

/**
 * A single-level object containing a map o properties available in source object.
 * @typedef {Object} ReplaceMap
 */

/**
 * An object result of the opetation of Replaecer.
 * @typedef {Object} ReplaceResult
 */


function isobj(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Generates a map for all the properties available inside a ReplaceSource.
 *
 * @argument {ReplaceSource} subject - The object to be mapped.
 * @return {ReplaceMap}
 */
export function Mapper(subject, prefix='') {
    function reducer(result, key) {
        const val = subject[key];
        return isobj(val) ?
            Object.assign(result, Mapper(val, `${key}.`, val)) :
            { ...result, [prefix + key]: val };
    }
    return Object
        .keys(subject)
        .reduce(reducer, {});
}

/**
 * Allows an object to be extended in place, by using replacer inside their values.
 *
 * @argument {ReplaceSource} subject - The object target for replacements.
 * @argument {ReplaceMap} replaceMap - The source of replacement key/vals.
 * @return {ReplaceResult}
 */
function replacer(subject, replaces) {

    function reducer(result, key) {
        const val = subject[key];
        return { ...result, [key]: isobj(val) ? replacer(val, replaces) : replace(val) };
    }

    function replace(value) {
        if (typeof value !== 'string' || value.indexOf('${') === -1) return value;
        let match;
        while (match = value.match(/\$\{([^}]+)\}/)) value = [
            value.substr(0, match.index),
            replaces[match[1]],
            value.substr(match.index + match[0].length)
        ].join('');
        return value;
    }

    return Object
        .keys(subject)
        .reduce(reducer, {});
}

/**
 * Allows an object to be extended in place recursively.
 *
 * @argument {ReplaceSource} subject
 * @return {ReplaceResult}
 */
export function Replacer(subject) {
    return replacer(subject, Mapper(subject));
}

export default Replacer;
