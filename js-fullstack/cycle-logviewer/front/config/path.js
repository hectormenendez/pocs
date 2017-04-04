const PATH = require('path');

/**
 * Path utilities.
 * Provides access to Node's path module wihthout the need of specifying an absolute path
 *
 * @param path <mixed> - if falsy, converts it to root, otherwise a path srtring
 *                       relative to the root folder.
 * @param predicate <string> - An optional string indicating a Node's Path method
 *                             to be applied to the function.
 */
module.exports = conf => (path=false, predicate=false, ...args) => {
    if (!path) path = conf.fs.root;
    else path = PATH.join(conf.fs.root, String(path).split('/').join(PATH.sep));
    if (!predicate) return path;
    if (typeof predicate != 'string')
        throw new  TypeError(`Expecting predicate string got: ${typeof predicate}`);
    if (typeof PATH[predicate] != 'function')
        throw new TypeError(`Invalid predicate function: ${predicate}`);
    args.unshift(path);
    return PATH[predicate](...args);
}
