const PATH = require('path');

const NeDB         = require('nedb');
const FeathersNeDB = require('feathers-nedb');

const Hooks = require('./hooks');

module.exports = function(){

    const db = new NeDB({
        filename : PATH.join(this.get('nedb'), 'users.db'),
        autoload : true
    });

    const route = '/users';

    // Initialize our service with any options it requires
    this.use(route, FeathersNeDB({
        Model    : db,
        paginate : {
            default : 5,
            max     : 25
        }
    }));

    // Get our initialize service to that we can bind hooks
    const service = this.service(route);

    // Set up our before hooks
    service.before(Hooks.before);

    // Set up our after hooks
    service.after(Hooks.after);
};
