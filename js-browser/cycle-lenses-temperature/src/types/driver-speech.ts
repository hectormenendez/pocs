import { Stream } from 'xstream';
import { Driver as DriverCycle } from '@cycle/run';

/** The signature for the `Source` coming from the `Speech Driver` */
export type Source = void;

/** The signature for a value inside a `Sink` from the `Speech Driver` */
export type Value = string;

/** The signature for a `Sink` returning from the `Speech Driver` */
export type Sink = Stream<Value>;

/** The `Speech Driver` signature. */
export type Driver = DriverCycle<Sink, Source>;
