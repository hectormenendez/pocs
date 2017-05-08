import $ from 'xstream';
import $FromEvent from 'xstream/extra/fromEvent';
import Debug from 'debug';
import Socket from 'socket.io-client';
import FeathersDriver from 'cycle-feathers';
import { run as Run } from '@cycle/run';
import { makeDOMDriver as DomDriver } from '@cycle/dom';
import { makeHistoryDriver as HistoryDriver } from '@cycle/history';

import { Router } from 'helpers/smv';
import Routes from './routes.json';

// The global stylesheet
import './index.css';

const debug = Debug('app');
// Connect to the Feathers Socket using the global settings coming from webpack.
const socket = Socket(`http://${APP.host}:${APP.port}`);
// Setup drivers
const drivers = {
    DOM: DomDriver(document.getElementsByTagName('main')[0]),
    Feathers: FeathersDriver(socket), // TODO: Use this.
    History: HistoryDriver() // TODO: Use this
};

// Generate the router stream of routes, and when its ready run the Cycle App
Router(Routes).addListener({ error: error => { throw error }, next: routes => {
    // Boot up the cycle.
    const cycle = Run(main.bind(null, routes), drivers);
    debug('cycle:run', drivers);
}});

// What to do if hot-module-replacement is enabled.
// TODO: haven't found an updated way of doing this.
//       cycle-restart wasn't updated for cycle-unified at the time this was written
if (module.hot) module.hot.accept(['helpers/smv'], () => {
    location.reload();
});

/**
 * The main function for the cycle App.
 *
 * This is run once the router streams has been resolved.
 * @param {object} routes - An object containing the routes and their SMV modules.
 * @param {object} sources - The Cycle sources normally sent to a Cycle App.
 */
function main(routes, sources) {
    return routes.root.main(sources);
}
