// Make sure the NODE_PATH environment variable is set, for relative importing.
const NODE_PATH = process.env.NODE_PATH;
if (!NODE_PATH || typeof NODE_PATH != 'string' || !NODE_PATH.length){
    console.error('Expecting a valid NODE_PATH environment variable');
    process.exit(1);
}
// Node modules
import PATH from 'path';
// Local modules
import Paths from 'config/path';

// This is the exportable that will be populated based in the JSON on config
export const Path = Object
    .keys(Paths)
    .map(name => ({ name, parts:Paths[name] }))
    .reduce((path, {name, parts}) => ({
        ...path,
        [name]: PATH.join(...parts.map(p =>
            p[0] + p[p.length-1] != '%%'? p : path[p.slice(1, -1)]
        ))
    }),{
        NODE_PATH: PATH.resolve(NODE_PATH),
        util: __dirname
    });

export default Path;
