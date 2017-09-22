// NPM modules
import Onionify from 'cycle-onionify';
import Isolate from '@cycle/isolate';
import { makeDOMDriver as DriverDOM } from '@cycle/dom';
import { makeHTTPDriver as DriverHTTP } from '@cycle/http';
import { timeDriver as DriverTime } from '@cycle/time';
import { setup as Setup } from '@cycle/run';
import { restartable as Restartable, rerunner as Rerunner } from 'cycle-restart';
// Local modules
import App from 'layouts/app';

const root = document.getElementsByTagName('main')[0];
const runner = Rerunner(
    Setup,
    () => ({
        DOM: Restartable(DriverDOM(root), { pauseSinksWhileReplaying: false }),
        HTTP: Restartable(DriverHTTP()),
        Time: DriverTime,
    }),
    Isolate,
);

runner(Onionify(App));

module.hot.accept('layouts/app', function cbackHMR() {
    runner(Onionify(require('layouts/app').default));
});
