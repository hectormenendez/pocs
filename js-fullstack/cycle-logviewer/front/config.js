const FS   = require('fs');
const PATH = require('path');

const $         = require('xstream').default;
const Flatten   = require('xstream/extra/flattenSequentially').default;
const Extendify = require('extendify');

// The object extension algorithm to be used for the configuration files.
const extend = Extendify({ arrays: 'concat' });

module.exports = function Conf(root){
    const conf = {};
    const base = PATH.basename(__filename, PATH.extname(__filename));
    // the cur environment
    conf.env = !process.env.NODE_ENV? 'development' : process.env.NODE_ENV.toLowerCase();
    // the computed filesystem properties
    conf.fs       = {};
    conf.fs.root  = root;
    conf.fs.ext   = PATH.extname(__filename);
    conf.fs[base] = PATH.join(conf.fs.root, base);

    return toStream(FS.stat, conf.fs[base])
        // Determine if the cfg directory exist and get its listing
        .map(stat => {
            if (!stat.isDirectory(conf.fs[base]))
                throw `Invalid conf.fs.${base} directory: ${conf.fs[base]}`;
            return toStream(FS.readdir, conf.fs[base])
        })
        .compose(Flatten)
        // Convert the directory listing to an individual stream
        .map(nodes => $.fromArray(nodes))
        .compose(Flatten)
        // gets each listed node stat to determine if its a file
        // (ignoring those files that are environment-specific)
        .map(node => {
            const path = PATH.join(conf.fs[base], node);
            return toStream(FS.stat, path)
                .map(stat => { stat.path = path; return stat })
        })
        .compose(Flatten)
        .filter(node =>
            node.isFile() && // is a file (duh)
            PATH.extname(node.path) === conf.fs.ext && // is the correct extension
            (PATH.basename(node.path).match(/\./g) || []).length == 1 // only has one dot
        )
        .map(node => node.path)
        // gets the name and requires the file as an object using the basename as an id.
        .map(path => {
            const base = PATH.basename(path, conf.fs.ext);
            const spec = PATH.join(PATH.dirname(path), [base, conf.env].join('.') + conf.fs.ext);
            let mod    = require(path);
            if (typeof mod != 'function') throw new TypeError(
                `Invalid module '${path}', expecting function, got: ${typeof mod}`
            );
            // Determine if an environment-specific file exists, and if it does
            // extend the base module with it.
            return toStream(FS.access, spec)
                // FS.access throws error, catch it and replace it with "true"
                .replaceError( () => $.of(true))
                .map(notfound => ({ base, mod, spec: notfound? null : require(spec) }));
        })
        .compose(Flatten)
        // Create a single object containing all properties (files) found.
        .fold((acc, cur) => {
            // get the current module by passing the currently accumulated conf.
            acc[cur.base] = cur.mod(acc);
            // if specific environment file exists, pass it the current module and
            // set the resulting extension as the new module.
            if (cur.spec) acc[cur.base] = extend(acc[cur.base], cur.spec(acc));
            return acc;
        }, conf)
        .last();
}

// a function that converts a node-callback pattern to a stream
function toStream (fn, ...args) {
    return $.create({
        start: listener => {
            args.push(function(...result){
                const err = result.shift();
                if (err) return listener.error(err);
                listener.next(...result);
                listener.complete();
            })
            return fn(...args);
        },
        stop: function(){}
    });
}
