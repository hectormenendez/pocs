// NPM modules
import $ from 'xstream';
import Isolate from '@cycle/isolate';
import Onionify from 'cycle-onionify';
import { setup as Setup, run as Run } from '@cycle/run';
import { makeDOMDriver as DriverDOM } from '@cycle/dom';
import { makeHTTPDriver as DriverHTTP } from '@cycle/http';
import { timeDriver as DriverTime } from '@cycle/time';
import { restartable as Restartable, rerunner as Rerunner } from 'cycle-restart';

/// #if PRODUCTION
console.log('here');
/// #else
console.log('there');
/// #endif
