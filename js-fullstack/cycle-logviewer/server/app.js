import PATH from 'path';

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

import Middleware from './middleware';
import Services from './services';

export const app = Feathers();

export default app
    .configure(FeathersConfig(__dirname))
    // Enable output compression
    .use(Compress())
    // Enable CORS
    .options('*', Cors())
    .use(Cors())
    // Static files service
    .use(Favicon(PATH.join(app.get('public'), 'favicon.ico')))
    .use('/', FeathersStatic(app.get('public')))
    // Allow JSON and URlEncoded bodies
    .use(BodyParser.json())
    .use(BodyParser.urlencoded({ extended:true }))
    // Configure Feathers
    .configure(FeathersHooks())
    .configure(FeathersRest())
    .configure(FeathersSocket())
    // Configure Services
    .configure(Services)
    .configure(Middleware)
