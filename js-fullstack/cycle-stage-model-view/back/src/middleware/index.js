'use strict';

const HandleError = require('feathers-errors/handler');
const Handle404s  = require('./not-found-handler');
const Logger      = require('./logger');

module.exports = function() {

    const app = this;

    // Add your custom middleware here. Remember, that
    // just like Express the order matters, so error
    // handling middleware should go last.
    app.use(Handle404s());
    app.use(Logger(app));
    app.use(HandleError());
};
