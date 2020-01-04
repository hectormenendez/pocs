import { Driver as CycleDriver } from '@cycle/run';
import { Stream } from 'xstream';
import { RouteMatcherReturn as RouterValue, RouterSource } from 'cyclic-router';

import { Component } from '.';

/** The signature for the `Source` coming from the `Router Driver` */
export class Source extends RouterSource {}

export interface Route extends RouterValue {
    value: Component<any>;
}

/** The signature for a value inside a `Sink` from the `DOM Driver` */
export type Value = string;

/** The signature for a `Sink` returning from the `DOM Driver` */
export type Sink = Stream<Value>;

/** The `DOM Driver` signature. */
export type Driver = CycleDriver<Sink, Source>;
