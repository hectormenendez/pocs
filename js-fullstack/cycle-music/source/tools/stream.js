// Node modules
import FS from 'fs';
import PATH from 'path';
// Npm modules
import $ from 'xstream';

export const $fromPath = path => $.create({
    start: listener => FS.readdir(path, function readdir(errRead, items) {
        if (errRead) return listener.error(errRead);
        let total = items.length;
        function emitItem(item) {
            listener.next(item);
            if (!(--total)) listener.complete();
        }
        items.forEach(function eachItem(item) {
            const pathFull = PATH.join(path, item);
            FS.stat(pathFull, function statItem(errStat, stat) {
                if (errStat) return listener.error(errStat);
                return emitItem({ stat, path: pathFull });
            });
        });
        return true;
    }),
    stop: () => {},
});

// Export all of xStream's methods, plus the ones defined here.
export default Object
    .keys($)
    .filter(key => typeof $[key] === 'function')
    .reduce((acc, key) => ({ ...acc, [key]: $[key].bind($) }), {
        fromPath: $fromPath,
    });
