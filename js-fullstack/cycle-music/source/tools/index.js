// Node modules
import FS from 'fs';
import PATH from 'path';
// Community modules
import $ from 'xstream';
// Local modules
import Path from 'tools/path';

/**
 * Wrapper for running scripts.
 */

// Find the argument that calls this file.
const pos = process.argv
    .map((arg, i) => arg.indexOf(__dirname) === 0? i : -1)
    .filter(pos => pos > -1)
    .shift();

// Each argument is a script to be run. Verify existance and require.
$
    .from(process.argv.slice(pos+1))
    .map($fromArg)
    .flatten()
    .map(({path}) => require(path))
    .subscribe({
        next: next => console.log('next', next),
        error: error => console.log('error', error)
    });

function $fromArg(arg) {
    const path = PATH.join(Path.scripts, `${arg}${PATH.extname(__filename)}`)
    return $.create({
        start: listener => FS.stat(path, function(error, stat){
            if (error) return listener.error(error);
            if (!stat.isFile()) return listener.error(new TypeError('Invalid script'));
            listener.next({ path, name:arg });
            return listener.complete();
        }),
        stop: () => {}
    });
}
