// NPM modules
import { makeDOMDriver as DriverDOM } from '@cycle/dom';
import { makeHTTPDriver as DriverHTTP } from '@cycle/http';
import { timeDriver as DriverTime } from '@cycle/time';
import { restartable as Restartable } from 'cycle-restart';

const root = document.getElementsByTagName('main')[0];

/// #if PRODUCTION

export default () => ({
    DOM: DriverDOM(root),
    HTTP: DriverHTTP(),
    Time: DriverTime,
});

/// #else

export default () => ({
    DOM: Restartable(DriverDOM(root), { pauseSinksWhileReplaying: false }),
    HTTP: Restartable(DriverHTTP()),
    Time: DriverTime,
})

/// #endif
