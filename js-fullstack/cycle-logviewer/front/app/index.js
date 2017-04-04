import $ from 'xstream';
import $FromEvent from 'xstream/extra/fromEvent';
import Socket from 'socket.io-client';
import FeathersDriver from 'cycle-feathers';
import { run as Run } from '@cycle/run';
import { makeDOMDriver as DomDriver } from '@cycle/dom';

import './index.css';

import Stage from './stage';
import Model from './model';
import View from './view.jsx';

export default function main(sources){
    const actors = Stage(sources);
    const sinks = Model(actors);
    sinks.DOM = sinks.State.map(state => View(state));
    return sinks;
}

Run(main, {
    DOM: DomDriver(document.getElementsByTagName('main')[0]),
    Feathers: FeathersDriver(Socket(`http://${APP.host}:${APP.port}`)),
})
