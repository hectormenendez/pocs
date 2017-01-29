import {run           as Run}         from '@cycle/xstream-run';
import {makeDOMDriver as DomDriver}   from '@cycle/dom';
import {isolate       as Isolate}     from '@cycle/isolate';
import {
    restart           as Restart,
    restartable       as Restartable} from 'cycle-restart';

import App from './root';

const root    = document.getElementsByTagName('main')[0];
const drivers = {
    DOM: Restartable(DomDriver(root), {pauseSinksWhileReplaying: false})
};

const {sinks, sources} = Run(App, drivers);

if (module.hot) module.hot.accept('./root', () => {
    const app = require('./root').default;
    restart(app, drivers, {sinks, sources}, Isolate)
});
