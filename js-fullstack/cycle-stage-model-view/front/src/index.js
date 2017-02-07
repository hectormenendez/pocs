import {run              as Run}          from '@cycle/xstream-run';
import {makeDOMDriver    as DomDriver}    from '@cycle/dom';
import {makeRouterDriver as RouterDriver} from 'cyclic-router';
import {createHistory    as History}      from 'history';

import $          from 'xstream';
import SwitchPath from 'switch-path';
import SocketIO   from 'socket.io-client';

import FeatherDriver from './drivers/feathers';
import Routes        from './routes'
import MVI from './helpers/mvi';

const socket = SocketIO('http://localhost:3030', { path:'/ws/' });

function main(sources){

    // const routes$ = sources.Router.define(Routes);
    // const router$ = routes$
    //     .map(({path, value}) => {
    //         const src = Object.assign({}, sources, { router: sources.Router.path(path) });
    //         return value(src);
    //     })
    //     .map(page => page.DOM)
    //     .flatten();

    const Root$ = MVI('poc', 'pages')(sources);
    return {
        DOM: Root$,
        router: $.of('/')
    }
}

Run(main, {
    DOM      : DomDriver(document.getElementsByTagName('main')[0]),
    Feathers : FeatherDriver(socket),
    // Router   : RouterDriver(History(), SwitchPath)
});
