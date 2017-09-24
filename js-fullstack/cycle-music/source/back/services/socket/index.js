
// NPM modules
import ServiceNeDB from 'feathers-nedb';
// Local modules
import ModelNeDB from 'models/nedb';

export default function ServiceSocket() {
    const name = 'socket';
    // Register the service
    this.use(`/${name}`, ServiceNeDB({ name, Model: ModelNeDB(`${name}.db`) }));
    // Initiaize the service
    const service = this.service(name);
}