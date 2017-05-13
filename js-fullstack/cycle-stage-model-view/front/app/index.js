import {run as Run} from '@cycle/run';
import {makeDOMDriver as DriverDOM} from '@cycle/dom';

// The global stylesheet
import './index.css';

import App from './root';

Run(App, {
    DOM: DriverDOM(document.getElementsByTagName('main')[0])
});

if (module.hot) module.hot.accept('./root', () => {
    // TODO: Haven't found a way to make cycle-restart to work with cycle-unity
    location.reload();
});

