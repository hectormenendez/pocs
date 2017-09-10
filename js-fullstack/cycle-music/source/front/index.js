// NPM modules
import Isolate from '@cycle/isolate';
import Onionify from 'cycle-onionify';
import { rerunner as Rerunner } from 'cycle-restart';
import { setup as Setup, run as Run } from '@cycle/run';
// Local modules
import Drivers from 'drivers';
import App from 'layouts/app';

/// #if PRODUCTION

Run(App, Drivers());

/// #else

const runner = Rerunner(Setup, Drivers, Isolate);
runner(App);
module.hot.accept('layouts/app', function(){
    const newApp = require('layouts/app').default;
    runner(newApp);
});

/// #endif
