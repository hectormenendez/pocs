import Isolate from '@cycle/isolate';
import $, { Stream as TypeStream } from 'xstream';
import { extractSinks as SinksGet } from 'cyclejs-utils';

import { TypeValue as TypeRouterValue  } from '../utils/drivers/router'
import { TypeSinks, TypeSources } from '../utils/types';

import { DriverNames } from '..';
import ComponentCounter, { TypeState as StateCounter } from './counter';
import ComponentSpeaker, { TypeState as StateSpeaker } from './speaker';

interface TypeState {
    counter: StateCounter,
    speaker: StateSpeaker,
}

// TODO: Create a Routes file and use it here.

export default function main(sources: TypeSources<TypeState>): TypeSinks<TypeState> {
    const { router } = sources;
    /**  A stream of available routes each containing a component as a value. */
    const routes$:TypeStream<TypeRouterValue> = router
        .define({
            // '/counter': isolate(Counter, 'counter'),
            '/': Isolate(ComponentCounter, 'counter'),
            '/speaker': Isolate(ComponentSpeaker, 'speaker')
        })
    /** A stream of sinks obtained from running each route component against the router */
    const componentSinks$: TypeStream<TypeSinks<TypeState>> = routes$
        .filter(({ value, path }) => (path && typeof value === 'function'))
        .map(({ path, value: main }) => main({ ...sources, router: router.path(path) }));
    /**  Converts Stream<Sinks> -> { [key]: Stream<Sink> }, using the avail driver names */
    const sinks = SinksGet(componentSinks$, DriverNames);
    return {
        ...sinks,
        router: sinks.router.startWith('/'),
    };
}
