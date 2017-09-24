// Local modules
import Stream from 'tools/stream';

export default Stream
    .fromPath(__dirname)
    .filter(({ stat }) => stat.isDirectory())
    .map(({ path }) => Stream.fromPromise(import(path)))
    .flatten()
    .map(service => function wrapperService() {
        this.configure(service.default);
    });
