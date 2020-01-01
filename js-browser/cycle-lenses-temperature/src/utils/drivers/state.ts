import { Stream as TypeStream } from 'xstream';
import { Driver as TypeCycleDriver } from '@cycle/run';
import {
    withState as Statify,
    StateSource as TypeCycleSource,
    Reducer as TypeCycleReducer
} from '@cycle/state';

import { TypeComponent } from '../types';

/**
 * The signature for a `Sink` returning from the `State Driver`
 * @param I An interface containing a `State` object.
 */
export type TypeSource<I> = TypeCycleSource<I>;

/**
 * The signature for a value inside a `Sink` from the `State Driver`
 * @param I An interface containing a `State` object.
 */
export type TypeValue<I> = TypeCycleReducer<I>;

/**
 * The signature for a `Sink` returning from the `State Driver`
 * @param I An interface containing a `State` object.
 */
export type TypeSink<I> = TypeStream<TypeValue<I>>;

/**
 * The `State Driver` signature.
 * @param I An interface containing a `State` object.
 */
export type TypeDriver<I> = TypeCycleDriver<TypeSink<I>, TypeSource<I>>;

export function Wrap(main: TypeComponent<any>): TypeComponent<any> {
    return Statify(main as any) as any;
}

export default null; // There's no DriverConstructor
