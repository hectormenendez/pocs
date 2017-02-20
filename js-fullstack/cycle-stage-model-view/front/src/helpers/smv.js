import $       from 'xstream';
import Isolate from '@cycle/isolate';
import FlatMap from 'xstream/extra/flattenSequentially';

export default function SMV(path){
    const files = ['stage.js', 'model.js', 'view.jsx'];

    return $
        .from(files)
        .map(base => $
             .fromPromise(import('../' + path + '/' + base))
             .map(esmodule => ({
                 name   : base.split('.')[0],
                 module : esmodule.default
             }))
        )
        .compose(FlatMap)
        .fold((acc,cur) => ({
            ...acc,
            [cur.name.charAt(0).toUpperCase() + cur.name.slice(1)]: cur.module
        }), {})
        .last()
        .map(({Stage, Model, View}) => sources => {
            function main (sources){
                const stage = Stage(sources);
                stage.sink  = stage.sink || {};
                const { state$, vnode$ } = Model(stage);
                const vtree$ = state$
                    .map(state => vnode$.map(vnode => View(state, vnode)))
                    .flatten();
                return Object.assign({ DOM: vtree$, state$ }, stage.sink);
            }
            return Isolate(main)(sources);
        });
}

export function Router(routes){
    return $
        .from(Object
            .keys(routes)
            .map(uri => ({ uri, path: routes[uri] }))
        )
        .map(route => SMV(route.path)
            .map(module => ({ [route.uri]: module }))
        )
        .compose(FlatMap)
        .fold((acc, cur) => Object.assign(cur, acc), {})
        .last();
}

export function Component({ source, path }){
    if (!source) throw new Error('Invalid sources');
    if (typeof path != 'string') throw new Error('Invalid path');

    return function(props){
        return SMV(path)
            .map(func => func(Object.assign(source, { props$: $.of(props || {}) })))
    }
}
