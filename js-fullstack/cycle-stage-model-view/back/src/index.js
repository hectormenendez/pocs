'use strict';

const Path           = require('path');
const Favicon        = require('serve-favicon');
const Compression    = require('compression');
const Cors           = require('cors');
const Feathers       = require('feathers');
const FeathersConf   = require('feathers-configuration');
const FeathersHooks  = require('feathers-hooks');
const FeathersRest   = require('feathers-rest');
const FeathersSocket = require('feathers-socketio');

const Middleware = require('./middleware');
const Services   = require('./services');

const app  = Feathers();
const cors = Cors();

app.configure(FeathersConf(Path.join(__dirname, '..')));

const conf = {
    host   : app.get('host'),
    port   : app.get('port'),
    public : app.get('public')
}

app
    .use(Compression())
    // Enanble CORS
    .options('*', cors)
    .use(cors)
    // Configure static folder
    .use(Favicon(Path.join(conf.public, 'favicon.ico')))
    .use('/', Feathers.static(conf.public))
    // Configure Feathers
    .configure(FeathersHooks())
    .configure(FeathersRest())
    .configure(FeathersSocket())
    .configure(Services)
    .configure(Middleware)
    // Start listening
    .listen(conf.port)
    .on('listening', ()=> {
        console.log(`Server started on ${conf.host}:${conf.port}`);
    });
