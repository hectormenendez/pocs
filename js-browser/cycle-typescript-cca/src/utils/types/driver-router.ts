import { Driver as CycleDriver } from '@cycle/run';
import { Stream } from 'xstream';
import { RouteMatcherReturn , RouterSource } from 'cyclic-router';

import { Component } from '.';

/** The signature for the `Source` coming from the `Router Driver` */
export class Source extends RouterSource {}

export type MatchedRoute = RouteMatcherReturn;

/** The signature for a value inside a `Sink` from the `DOM Driver` */
export type Value = string;

/** The signature for a `Sink` returning from the `DOM Driver` */
export type Sink = Stream<Value>;

/** The `DOM Driver` signature. */
export type Driver = CycleDriver<Sink, Source>;


export namespace Resolve {

    export interface Route {
        path: string;
        id: string;
    }

    export type Routes = Route[];

    export type Importer = ({ path, id }: Route) => Promise<Module>;

    export interface Module {
        default: Component<object>;
    }

    export type Value = { [path: string]: Component<object> };

    export interface Response {
        [path: string]: Component<object>;
    }

}
