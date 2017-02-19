import $       from 'xstream';
import Isolate from '@cycle/isolate';
import FlatMap from 'xstream/extra/flattenConcurrently';

export function SMV(path){
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
                const vtree$  = vnode$
                    .map(vnode => state$.map(state => View(state, vnode)))
                    .flatten();
                return Object.assign({ state$, DOM: vtree$ }, stage.sink);
            }
            return Isolate(main)(sources);
        });
}

export default routes => $
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
