import {makeDOMDriver as DomDriver} from '@cycle/dom';
import {run as Run} from '@cycle/xstream-run';

import App from './root';

// tempo
import {makeHTTPDriver as HttpDriver} from '@cycle/http';
import SocketIO from 'socket.io-client';
import FeatherDriver from './drivers/feathers';

const socket = SocketIO('http://localhost:3030', { path:'/ws/' });

Run(App, {
    DOM      : DomDriver(document.getElementsByTagName('main')[0]),
    HTTP     : HttpDriver(),
    Feathers : FeatherDriver(socket)
});
