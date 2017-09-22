/**
 * An object subject to replacement using ToolReplacer. It can be multi-level.
 * @typedef {Object} ReplaceSource
 */

/**
 * A single-level object containing a map o properties available in source object.
 * @typedef {Object} ReplaceMap
 */

/**
 * An object result of the opetation of ToolReplacer.
 * @typedef {Object} ReplaceResult
 */

/**
 * Allows an object to be extended in place recursively.
 *
 * @argument {ReplaceSource} subject
 * @return {ReplaceResult}
 */
export default function ToolReplacer(subject) {
    return replacer(subject, mapper(subject));
}

function isobj(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}


/**
 * Generates a map for all the properties available inside a ReplaceSource.
 *
 * @argument {ReplaceSource} subject - The object to be mapped.
 * @return {ReplaceMap}
 */
function mapper(subject, prefix='') {
    return Object
        .keys(subject)
        .reduce(reducer, {});
    function reducer(result, key) {
        const val = subject[key];
        return isobj(val)?
            Object.assign(result, mapper(val, `${key}.`, val)) :
            { ...result, [prefix+key]: val };
    }
}

/**
 * Allows an object to be extended in place, by using replacer inside their values.
 *
 * @argument {ReplaceSource} subject - The object target for replacements.
 * @argument {ReplaceMap} replaceMap - The source of replacement key/vals.
 * @return {ReplaceResult}
 */
function replacer(subject, replaces){
    return Object
        .keys(subject)
        .reduce(reducer, {});

    function reducer(result, key){
        const val = subject[key];
        return { ...result, [key]: isobj(val)? replacer(val, replaces) : replace(val) };
    }

    function replace(value){
        if (typeof value !== 'string' || value.indexOf('${') === -1) return value;
        let match;
        while (match = value.match(/\$\{([^}]+)\}/)) value = [
            value.substr(0, match.index),
            replaces[match[1]],
            value.substr(match.index + match[0].length)
        ].join('');
        return value;
    }
}
