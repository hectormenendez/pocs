// NPM modules
import Feathers from 'feathers';
import FeathersHandler from 'feathers-errors/handler';
import FeathersNotFound from 'feathers-errors/not-found';
import FeathersHooks from 'feathers-hooks';
import FeathersSocket from 'feathers-socketio';
import Debug from 'debug';
import Cors from 'cors';
import Helmet from 'helmet';
import Compression from 'compression';
import BodyParser from 'body-parser';
// Local modules
import Path from 'tools/path';
import { Mapper } from 'tools/replacer';
import Config from 'tools/config/back';
import Stream from 'tools/stream';
import Services$ from './services';

const feathers = Feathers();

// Make Config a flat object so it can be "used" by the server easily.
const config = Mapper(Config);

// ------------------------------------------------------------------- Basic configuration
const feathersBasic$ = Stream.of(feathers
    // set configuration to server
    .configure(() => Object
        .keys(config)
        .forEach(key => feathers.set(key, config[key])))
    // Enable Cross Origin Resource Sharing
    .use(Cors())
    // Adds some security mesaurements (not bullet proof thoigh)
    .use(Helmet())
    // Enable gzip compression on responses.
    .use(Compression())
    // Allow the automatic parsing of JSON and query strings.
    .use(BodyParser.json())
    .use(BodyParser.urlencoded({ extended: true }))
    // Enable the static server on the public route
    .use('/', Feathers.static(Path.output)),
);

// ------------------------------------------------------- Plugins, Providers & Middleware
const feathersProviders$ = Stream.of(feathers
    .configure(FeathersHooks())
    .configure(FeathersSocket()),
);

const feathersServices$ = Services$
    .map(servicesWrapper => feathers.configure(servicesWrapper));

// if nothing else matches, this middleware will send a 404.
const feathersFallback$ = Stream.of(feathers
    .use(FeathersNotFound())
    .use(FeathersHandler()),
);

// ------------------------------------------------------------------------ Initialization
const port = process.env.PORT || feathers.get('server.port');
const host = process.env.HOST || feathers.get('server.host');
const onError = error => Debug('app:error')(error);
const onReady = () => Debug('app:ready')('%s:%d', host, port);
Stream
    .combine(
        feathersBasic$,
        feathersProviders$,
        feathersServices$,
        feathersFallback$,
    )
    .addListener({
        error: onError,
        next: () => feathers
            .listen(port, host)
            .on('listening', onReady)
            .on('unhandledRejection', onError),
    });
