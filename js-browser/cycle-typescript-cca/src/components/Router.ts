import Isolate from '@cycle/isolate';
import { extractSinks as SinksGet } from 'cyclejs-utils';

import { Route } from '../utils/types/driver-router';
import { Stream, Sinks, Sources } from '../utils/types';

import { DriverNames } from '..';
import Counter, { Type as TypeCounter } from '../pages/Counter';
import Speaker, { Type as TypeSpeaker } from '../pages/Speaker';

interface State {
    counter: TypeCounter.State,
    speaker: TypeSpeaker.State,
}

// TODO: Create a Routes file and use it here.
export default function main(sources: Sources<State>): Sinks<State> {

    /**  A stream of available routes each containing a component as a value. */
    const routes$: Stream<Route> = sources.router.define({
        '/': Isolate(Counter, 'counter'),
        '/speaker': Isolate(Speaker, 'speaker')
    });

    /** A stream of sinks obtained from running each route component against the router */
    const componentSinks$: Stream<Sinks<State>> = routes$
        .filter(({ value, path }) => path && typeof value === 'function')
        .map(({ path, value: component }) => {
            const router = sources.router.path(path);
            return component({ ...sources, router });
        });

    /**  Converts Stream<Sinks> -> { [key]: Stream<Sink> }, using the avail driver names */
    const sinks = SinksGet(componentSinks$, DriverNames);

    return {
        ...sinks,
        router: sinks.router.startWith('/')
    };
}
