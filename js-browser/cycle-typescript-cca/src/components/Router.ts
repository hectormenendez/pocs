import { extractSinks as SinksGet } from 'cyclejs-utils';

import { DriverNames } from '..';
import { Routes$ } from '../routes';
import { Source as SourceRouter, MatchedRoute } from '../utils/types/driver-router';
import { Stream, Sinks, Sources, } from '../utils/types';

export default function main(sources: Sources<object>): Sinks<object> {
    /** Define all the the available routes, and start listening for the current one */
    const routes$: Stream<MatchedRoute> = Routes$
        .map((routes)=> sources.router.define(routes))
        .flatten()
    /** Using the matched route, instantiate the corresponding component */
    const component$: Stream<Sinks<object>> = routes$
        .filter(({ path, value }) => (path && typeof value === 'function'))
        .map(({ path, value: component }) => {
            const router: SourceRouter = sources.router.path(path);
            return component({ ...sources, router });
        });
    /** Gets all sinks from currently loaded component **/
    const sinks = SinksGet(component$, DriverNames);
    return {
        ...sinks,
        router: sinks.router,
    };
}
