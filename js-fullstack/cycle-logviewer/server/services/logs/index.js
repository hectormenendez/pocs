import PATH from 'path';

import NeDB from 'nedb';
import FeathersNeDB from 'feathers-nedb';

import Hooks from './hooks';

export default function Logs(){

    const db = new NeDB({
        filename: PATH.join(this.get('nedb'), 'logs.db'),
        autoload: true,
    });

    const route = '/logs';

    // Initialize our service
    this.use(route, FeathersNeDB({
        Model: db,
        paginate:{
            default: 10,
            max: 99,
        },
    }));

    // Get the service initialized
    const service = this.service(route);

    // Setup the hooks
    service.before(Hooks.before);
    service.after(Hooks.after);
};
