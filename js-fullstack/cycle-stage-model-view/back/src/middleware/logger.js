'use strict';

const Winston = require('winston');

module.exports = function(app) {

    // Add a logger to our app object for convenience
    app.logger = Winston;

    return function(error, req, res, next) {
        if (!error) return next();
        const message = `${error.code ? `(${error.code}) ` : '' }Route: ${req.url} - ${error.message}`;
        if (error.code === 404) Winston.info(message);
        else {
            Winston.error(message);
            Winston.info(error.stack);
        }
        next(error);
    }

};
