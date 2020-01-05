import SwitchPath from 'switch-path';
import { routerify as Routerify } from 'cyclic-router';

import { Component } from '../types';

export function Wrap(main: Component<any>): Component<any> {
    return Routerify(main, SwitchPath);
}

export default null; // there's no DriverConstructor
