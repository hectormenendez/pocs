// Make sure the NODE_PATH environment variable is set, for relative importing.
const NODE_PATH = process.env.NODE_PATH;
if (!NODE_PATH || typeof NODE_PATH != 'string' || !NODE_PATH.length){
    console.error('Expecting a valid NODE_PATH environment variable');
    process.exit(1);
}
// Node modules
import PATH from 'path';
// Local modules
import Replacer from 'tools/replacer';
import Config from 'config/path';

const path = Replacer(Object
    .keys(Config)
    .reduce((result, key) => ({
        ...result,
        [key]: Array.isArray(Config[key]) ? PATH.join(...Config[key]) : Config[key]
    }), {
        // if more than one path is sent, always use the last
        // (more likely to be the source path)
        // TODO: Find a more consistent way of fixing this.
        NODE_PATH: PATH.resolve(NODE_PATH.split(':').pop()),
    })
);

export default Object
    .keys(path)
    .reduce((result, key) => ({ ...result, [key]: PATH.resolve(path[key]) }), {});
