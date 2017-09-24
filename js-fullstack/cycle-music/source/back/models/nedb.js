// Node modules
import PATH from 'path';
// NPM modules
import NeDB from 'nedb';
// Local modules
import Path from 'tools/path';

export default function Model(name) {
    if (typeof name !== 'string') throw new TypeError('Expecting a model name.');
    return new NeDB({
        filename: PATH.join(Path.data, name),
        autoload: true,
    });
}
