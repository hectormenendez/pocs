import { Stream } from 'xstream';
import { Driver as DriverCycle } from '@cycle/run';
import { MainDOMSource, VNode } from  '@cycle/dom';

/** The signature for the `Source` coming from the `DOM Driver` */
export type Source = MainDOMSource;

/** The signature for a value inside a `Sink` from the `DOM Driver` */
export type Value = VNode;

/** The signature for a `Sink` returning from the `DOM Driver` */
export type Sink = Stream<Value>;

/** The `DOM Driver` signature. */
export type Driver = DriverCycle<Sink, Source>;

