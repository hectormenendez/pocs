import { run as Run } from '@cycle/run';
import { makeDOMDriver as DomDriver } from '@cycle/dom';
import { makeRouterDriver as RouterDriver } from 'cyclic-router';

import $ from 'xstream';
import SwitchPath from 'switch-path';
import SocketIO from 'socket.io-client';
import CreateHistory from 'history/createBrowserHistory';

import FeatherDriver from './drivers/feathers';
import Routes$ from './routes';
import './index.css';

const socket = SocketIO('http://localhost:3030', { path:'/ws/' });

function main(routes, sources){

    const page$ = sources.Router
        .define(routes)
        .map(router => {
            const component = router.value;
            const obj = { Router: sources.Router.path(router.path) };
            const src = Object.assign(obj, sources);
            return component(src);
        })

    return {
        DOM      : page$.map(page => page.DOM).flatten(),
        Router   : page$.map(page => page.Router   || $.never()).flatten(),
        Feathers : page$.map(page => page.Feathers || $.never()).flatten(),
    }
}

function onReady(routes){
    Run(main.bind(null, routes), {
        DOM      : DomDriver(document.getElementsByTagName('main')[0]),
        Feathers : FeatherDriver(socket),
        Router   : RouterDriver(CreateHistory(), SwitchPath)
    });
}

Routes$.addListener({ next: onReady });
