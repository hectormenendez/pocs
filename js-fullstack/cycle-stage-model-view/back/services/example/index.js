import PATH from 'path';

import NeDB from 'nedb';
import FeathersNeDB from 'feathers-nedb';

import Hooks from './hooks';

export default function ServiceExample(){

    const db = new NeDB({
        filename: PATH.join(this.get('nedb'), 'example.db'),
        autoload: true,
    });

    const route = '/example';

    // Initialize our service
    this.use(route, FeathersNeDB({
        Model: db,
        paginate:{
            default: 99,
            max: Infinity,
        },
    }));

    // Get the service initialized
    const service = this.service(route);

    // Setup the hooks
    service.before(Hooks.before);
    service.after(Hooks.after);
};
