import FS from 'fs';
import PATH from 'path';

export default function Loader(root){
    return FS
        .readdirSync(root)
        .map(basename => PATH.join(root, basename))
        .map(path => FS.statSync(path).isDirectory()? require(path).default : null)
        .filter(Boolean);
}
