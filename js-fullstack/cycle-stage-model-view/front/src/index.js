import {makeDOMDriver as DomDriver} from '@cycle/dom';
import {run as Run} from '@cycle/xstream-run';

import App from './root';

Run(App, {
    DOM: DomDriver(document.getElementsByTagName('main')[0])
});
