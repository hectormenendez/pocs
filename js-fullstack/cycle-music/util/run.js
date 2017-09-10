// Node modules
import FS from 'fs';
import PATH from 'path';
// Local modules
import Path from './path';

const argv = process.argv.slice(process.argv.indexOf(__filename) + 1);
argv.forEach(arg => require(PATH.join(Path.util_scripts, arg)).default);
