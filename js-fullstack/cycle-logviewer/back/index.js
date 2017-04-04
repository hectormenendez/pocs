import PATH from 'path';

import $ from 'xstream';
import Feathers from 'feathers';
import {static as FeathersStatic} from 'feathers';
import FeathersConfig from 'feathers-configuration';
import FeathersHooks from 'feathers-hooks';
import FeathersRest from 'feathers-rest';
import FeathersSocket from 'feathers-socketio';

import Favicon from 'serve-favicon';
import Compress from 'compression';
import Cors from 'cors';
import BodyParser from 'body-parser';

import CommonConfig from '../config.common';
import Middleware from './middleware';
import Services from './services';
import Front  from '../front';

export const commonConfig$ = $.of(CommonConfig)
    .map(config => Object.keys(config).map(key => ({ key, val:config[key] })));

export const feathers$ = $
    .of(Feathers());

export const server$ = $
    // setup the common config
    .combine(commonConfig$, feathers$)
    .map(([configs, server]) => {
        configs.forEach(({key,val}) => server.set(key, val));
        return server;
    })
    // Configure Feathers behaviour
    .map(server => server
        .configure(FeathersConfig(__dirname))
        // Enable output compression
        .use(Compress())
        // Enable CORS
        .options('*', Cors())
        .use(Cors())
        // The favicon will be served separatedly
        .use(Favicon(PATH.join(server.get('public'), 'favicon.ico')))
        // Allow JSON and URlEncoded bodies
        .use(BodyParser.json())
        .use(BodyParser.urlencoded({ extended:true }))
        // Configure Feathers
        .configure(FeathersHooks())
        .configure(FeathersRest())
        .configure(FeathersSocket())
    )
    // Setup frontend middleware
    .map(server => Front(server))
    .flatten()
    // Extra middleware and services are setup after the frontend.
    .map(server => server
        .configure(Services)
        .configure(Middleware)
    );


server$.addListener({
    error: error => { throw error },
    next: server => {
        // Prepare the server to listen
        const port = server.get('port');
        const host = server.get('host');
        server
            .listen(port)
            .on('listening', () => console.log(`Server on ${host}:${port}`));
    }
});
