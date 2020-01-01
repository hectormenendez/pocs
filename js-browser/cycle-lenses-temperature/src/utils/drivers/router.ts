import SwitchPath from 'switch-path';
import { Driver as TypeCycleDriver } from '@cycle/run';
import { Stream as TypeStream } from 'xstream';
import {
    routerify as Routerify,
    RouteMatcherReturn as TypeRouterValue,
    RouterSource as TypeRouterSource,
} from 'cyclic-router';

import { TypeComponent } from '../types';
import { TypeValue as TypeHistoryValue } from '../drivers/history'

/** The signature for the `Source` coming from the `Router Driver` */
export class TypeSource extends TypeRouterSource {}

/** The signature for a value inside a `Sink` from the `DOM Driver` */
export interface TypeValue extends TypeRouterValue {
    value: TypeComponent<any>;
}

/** The signature for a `Sink` returning from the `DOM Driver` */
export type TypeSink = TypeStream<TypeValue|TypeHistoryValue>;

/** The `DOM Driver` signature. */
export type TypeDriver = TypeCycleDriver<TypeSink, TypeSource>;

export function Wrap(main: TypeComponent<any>): TypeComponent<any> {
    return Routerify(main, SwitchPath);
}

export default null; // there's no DriverConstructor
