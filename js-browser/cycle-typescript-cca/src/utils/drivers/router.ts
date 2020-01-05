import $ from 'xstream';
import Flatten from 'xstream/extra/flattenSequentially';
import Isolate from '@cycle/isolate';
import SwitchPath from 'switch-path';
import { routerify as Routerify } from 'cyclic-router';

import { Component, Stream } from '../types';
import { Resolve as R } from '../types/driver-router';

export function Wrap(main: Component<any>): Component<any> {
    return Routerify(main, SwitchPath);
}

export function Resolve(routes: R.Routes, importer: R.Importer): Stream<R.Response> {
    return (
        $.from(routes)
            // Resolve the promises and then resolve the routes.
            .map(Resolve)
            .compose(Flatten)
            // merge all the resolved componentes into a single object
            .fold((acc, cur) => ({ ...acc, ...cur }), {})
            .last()
    );

    function Resolve({ path, id }: R.Route): Stream<R.Value> {
        const promise = importer({ path, id }).then(
            (module: R.Module): R.Value => {
                const component = Isolate(module.default, id);
                return { [path]: component };
            },
        );
        return $.from(promise);
    }
}

export default null; // there's no DriverConstructor
