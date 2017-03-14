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
                // Set the stage using the sources.
                const stage = Stage(sources);
                // Model data using the stage, obtaining the sinks.
                // Note: Sinks can alse be set on stage
                //       (but would be overriden by the ones returned by the model)
                const sinks = Object.assign(stage.sink || {}, Model(stage))
                // A state sink must always exist.
                const {State} = sinks;
                if (!State) throw new Error('Expecting a State Stream');
                // Generate the view once the State has been resolved.
                // if a DOM sink is sent, then resolve it first and then generate.
                if (!sinks.DOM) sinks.DOM = $.of(null);
                const DOM = State
                    .map(state => sinks.DOM.map(vtree => View(state, vtree)))
                    .flatten();
                return { ...sinks, DOM };
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
