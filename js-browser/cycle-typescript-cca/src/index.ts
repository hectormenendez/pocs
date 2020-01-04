import { run as Run } from '@cycle/run';

import DriverDOM from './drivers/dom';
import DriverHistory from './drivers/history';
import DriverSpeech from './drivers/speech';
import { Wrap as WrapRouter } from './drivers/router';
import { Wrap as WrapState } from './drivers/state'

import Router from './components/Router';

export const Drivers = {
    DOM: DriverDOM('main'),
    history: DriverHistory(),
    speech: DriverSpeech(),
    // router: Generated with Wrapper
    // state: Generated with Wrapper
};

export const DriverNames = Object
    .keys(Drivers)
    .concat('router', 'state');

const mainWithRouter = WrapRouter(Router);
const mainWithState = WrapState(mainWithRouter);

Run(mainWithState as any, Drivers);