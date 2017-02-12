import { run              as Run          } from '@cycle/xstream-run';
import { makeDOMDriver    as DomDriver    } from '@cycle/dom';
import { makeRouterDriver as RouterDriver } from 'cyclic-router';
import { createHistory    as History      } from 'history';

import $          from 'xstream';
import SwitchPath from 'switch-path';
import SocketIO   from 'socket.io-client';

import FeatherDriver from './drivers/feathers';
import Routes        from './routes'

const socket = SocketIO('http://localhost:3030', { path:'/ws/' });

function main(sources){

    const page$ = sources.Router
        .define(Routes)
        .map(router => {
            const component = router.value;
            const obj = { Router: sources.Router.path(router.path) };
            const src = Object.assign(obj, sources);
            return component(src);
        })

    return {
        DOM    : page$.map(page => page.DOM).flatten(),
        Router : page$.map(page => page.Router || $.never()).flatten()
    }
}

Run(main, {
    DOM      : DomDriver(document.getElementsByTagName('main')[0]),
    Feathers : FeatherDriver(socket),
    Router   : RouterDriver(History(), SwitchPath)
});
