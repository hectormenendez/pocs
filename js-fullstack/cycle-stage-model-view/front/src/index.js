import $ from 'xstream';
import Debug from 'debug';
import Socket from 'socket.io-client';
import SwitchPath from 'switch-path';
import { createBrowserHistory as CreateHistory } from 'history';
import FeathersDriver from 'cycle-feathers';
import { run as Run } from '@cycle/run';
import { makeDOMDriver as DomDriver } from '@cycle/dom';
import { makeRouterDriver as RouterDriver } from 'cyclic-router';

import { Router } from './helpers/smv';
import Routes from './routes';

import './index.css';

localStorage.debug = 'money*'

const debug = Debug('money:index');
const socket = Socket('http://localhost:3030', { path: '/ws' });

socket.on('connect', function(){
    debug('connected',  { id: socket.id });
    Router(Routes).addListener({ // returns an observable.
        error: error => { throw error },
        next: routes => {
            debug('routes', Object.keys(routes));
            onReady(routes, { socket });
        }
    })
})

function onReady(routes, { socket }){
    const  drivers = {
        DOM: DomDriver(document.getElementsByTagName('main')[0]),
        Feathers: FeathersDriver(socket),
        Router: RouterDriver(CreateHistory(), SwitchPath)
    }
    debug('drivers', Object.keys(drivers));
    const app = main.bind(main, routes);
    Run(app, drivers);
}

function main(routes, sources){
    debug('main:sources', sources);
    const route$ = sources.Router.define(routes)
        .map(route => route.value({
            ...sources,
            Router: sources.Router.path(route.path)
        }))

    const sinks = Object
        .keys(sources)
        .reduce((sinks, name) => ({
            ...sinks,
            [name]: route$
                .map(routeSinks  => routeSinks[name] || $.never())
                .flatten()
        }), {});
    debug('main:sinks', sinks);
    return sinks;
}

