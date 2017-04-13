import $ from 'xstream';
import $FromEvent from 'xstream/extra/fromEvent';
import Socket from 'socket.io-client';
import FeathersDriver from 'cycle-feathers';
import { run as Run } from '@cycle/run';
import { makeDOMDriver as DomDriver } from '@cycle/dom';

import './index.css';

import SMV from 'helpers/smv';

const root$ = SMV('root');

root$.addListener({
    error: error => { throw error },
    next: main => Run(main, {
        DOM: DomDriver(document.getElementsByTagName('main')[0]),
        Feathers: FeathersDriver(Socket(`http://${APP.host}:${APP.port}`)),
    })
});
