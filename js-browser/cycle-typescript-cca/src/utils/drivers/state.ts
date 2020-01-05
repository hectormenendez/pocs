import { withState as Statify } from '@cycle/state';

import { Component } from '../types';

export function Wrap(main: Component<any>): Component<any> {
    return Statify(main as any) as any;
}

export default null; // There's no DriverConstructor
