import $ from 'xstream';
import Isolate from '@cycle/isolate';
import FlatMap from 'xstream/extra/flattenSequentially';

import { TypeObjectPlain } from './is'

const EXT = '.js';

function Main ({ Stage, Model, View }, sources){
    const fnView = (state) => View(state);
    /**
     * Staged members.
     * @type {object} Properties, methods and intents that will be used in the Model.
     * @note if the `sinks` member is staged, its contents will be exposed.
     */
    const staged = Stage(sources);
    const sinks = staged.sinks || {};
    /**
     * Modeled State.
     * it can be either:
     * - `State<Stream>`: That will be converted to an `Object` containing:
     *   - `State<Stream>`: The stream containing the internal state.
     *   - `DOM<Stream>`: The resulting `vtree<Stream>` from mapping the state to the View.
     * - `Sinks<Object>`: An `Object` containing all the sinks for this Compoonent.
     *   if no `DOM<Stream>` property is sent, it will be populatedd with the resulting
     *   `vtree<Stream>` from mapping the state to the View.
     */
    const model = Model(staged);
    const isStream = (value) => value instanceof $ && !!value.addListener;
    if (model instanceof $ && !!model.addListener) {
        return {
            ...sinks,
            State: model,
            DOM: model.map(fnView),
        }
    }
    const isObject = TypeObjectPlain(model);
    if (isObject && model.State) {
        if (!isStream(model.State)) {
            const msg = `Expecting a State<Stream> sink. got: ${typeof model.State}`;
            throw new TypeError(msg);
        }
        Object.assign(sinks, {
            ...model,
            DOM: model.State.map(fnView),
        });
        console.log('sinks>', sinks);
        return sinks;
    }
    if (isObject) {
        return { ...sinks, ...model }
    }
    const x = $;
    debugger
    const msg = `Expecting either Sinks<Object> or State<Stream>, got: ${typeof model}`;
    throw new TypeError(msg);
}

export const Handler = (smv) => (sources) => {
    const main = (...params) => {
        try {
            return Main(smv, ...params);
        } catch (e) {
            throw e;
        }
    }
    return Isolate(main)(sources);
}

export default function SMV(path){
    // a promise was sent, resolve it, and handle it (assuming the module is correct)
    if (path && path.constructor === Promise) {
        return $
            .fromPromise(path)
            .map((imported) => Handler(imported.default));
    }
    // if the path is an object, handle directly.
    if (TypeObjectPlain(path)) {
        return $.of(Handler(path));
    }
    // at this point only a string would make sense, send an error otherwise.
    if (typeof path !== 'string') {
        throw new Error(`Expecting a string, got: ${typeof path}`);
    }
    // automatize the handling of SMV
    return $
        .from(['stage', 'model', 'view'])
        // import everything create a object containing both the imported default and the name of the module.
        .map((name) => $
            .fromPromise(import('../' + path + '/' + name + EXT))
            .map(esmodule => ({
                name,
                module : esmodule.default
            }))
        )
        .compose(FlatMap)
        // converts its to a single object containing the first letter of the name in capital. ej. { Stage, Model, View }
        .fold((acc,cur) => ({
            ...acc,
            [cur.name.charAt(0).toUpperCase() + cur.name.slice(1)]: cur.module
        }), {})
        .last()
        .map(Handler);
}

export function Router(routes){
    return $
        // convert to an array on objects with the key as an id.
        .from(Object.keys(routes).map((id) => ({ id, ...routes[id]})))
        .map(route => SMV(route.module)
            .map(imported => ({ [route.path]: imported }))
        )
        .compose(FlatMap)
        .fold((acc, cur) => Object.assign(cur, acc), {})
        .last()
        // TODO: Debug using the debug module
        // .debug(x => console.log('====>', x))
}

export function Component({ sources, path }){
    if (!sources) throw new Error('Invalid sources');
    if (typeof path != 'string') throw new Error('Invalid path');
    return function(Props){
        const component$ = SMV(path).map(smv => smv({ ...sources, Props }));
        // Return an object with dynaminc property getter that returns sink streams.
        return new Proxy({}, {
            get(target, key) {
                return component$
                    .map(component => component[key])
                    .filter(Boolean)
                    .flatten();
            }
        });
    }
}
