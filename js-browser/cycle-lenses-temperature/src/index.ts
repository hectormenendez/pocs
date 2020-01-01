import { run as Run } from '@cycle/run';

import DriverDOM from './utils/drivers/dom';
import DriverHistory from './utils/drivers/history';
import DriverSpeech from './utils/drivers/speech';
import { Wrap as WrapRouter } from './utils/drivers/router';
import { Wrap as WrapState } from './utils/drivers/state'

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