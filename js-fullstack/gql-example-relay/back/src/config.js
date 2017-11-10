import PATH from 'path';

export const Path = Object
    .keys(process.env)
    .filter(key => key.indexOf('npm_package_directories_') === 0)
    .reduce((path, key) => ({
        ...path,
        [key.replace('npm_package_directories_', '')]: PATH.resolve(process.env[key]),
    }), {
        root: process.cwd(),
    });

export const Config = require(PATH.join(Path.cfg, 'common.json')); // eslint-disable-line

export default {
    ...Config,
    path: Path,
};
