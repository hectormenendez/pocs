import { makeDOMDriver as Make } from '@cycle/dom';

import { Driver } from '../types/driver-dom';

export default function Driver(selector: string): Driver {
    return Make(selector);
}