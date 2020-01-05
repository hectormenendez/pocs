import { Stream, MemoryStream } from 'xstream';
import { StateSource, Reducer } from '@cycle/state';
import { Driver as CycleDriver } from '@cycle/run';

/**
 * The signature for a `Sink` returning from the `State Driver`
 * @param I An interface containing a `State` object.
 */
export type Source<I> = StateSource<I>;

/**
 * The signature for a value inside a `Sink` from the `State Driver`
 * @param I An interface containing a `State` object.
 */
export type Value<I> = Reducer<I>;

/**
 * The signature for a `Sink` returning from the `State Driver`
 * @param I An interface containing a `State` object.
 */
export type Sink<I> = Stream<Value<I>> | MemoryStream<Value<I>>;

/**
 * The `State Driver` signature.
 * @param I An interface containing a `State` object.
 */
export type Driver<I> = CycleDriver<Sink<I>, Source<I>>;
