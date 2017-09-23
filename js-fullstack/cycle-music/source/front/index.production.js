// NPM modules
import Onionify from 'cycle-onionify';
import { makeDOMDriver as DriverDOM } from '@cycle/dom';
import { makeHTTPDriver as DriverHTTP } from '@cycle/http';
import { timeDriver as DriverTime } from '@cycle/time';
import { run as Run } from '@cycle/run';
// Local modules
import App from './example';

const root = document.getElementsByTagName('main')[0];

Run(Onionify(App), {
    DOM: DriverDOM(root),
    HTTP: DriverHTTP(),
    Time: DriverTime,
});
