import $ from 'xstream';
import Debug from 'debug';
import Isolate from '@cycle/isolate';
import Flatten from 'xstream/extra/flattenSequentially';
import Validate from '@gik/validate';

const xsType = {
    stream: $.create().constructor,
    memory: $.createWithMemory().constructor,
};

export default function SMV(path){
    const files = ['Stage', 'Model', 'View.jsx'];
    const debug = Debug(`smv:${path}`);

    return $
        .from(files)
        .map(file => ({
            name: file.split('.')[0],
            path: [path,file].join('/').toLowerCase(),
        }))
        .map(({ name, path }) => $
            .fromPromise(import('../' + path))
            .map(mod => ({ [name]:mod.default }))
        )
        .compose(Flatten)
        .debug(mod => debug(Object.keys(mod)[0] + ' loaded'))
        .fold((modules, mod) => Object.assign(modules, mod), {})
        .last()
        .map(modules => sources => Isolate(MainSMV.bind(null, modules, debug))(sources))
};

export function Component(options){
    const {sources,path} = Validate(options, {
        sources:{ type:Object, required:true },
        path:{ type:String, required:true }
    });
    return function ComponentSMV(Props){
        // Get the SMV function and append the Props source.
        const component$ = SMV(path).map(smv => smv({ ...sources, Props }));
        // Return an object with dynaminc property getter that returns sink streams.
        return new Proxy({}, {
            get(target, key) {
                return component$
                    .map(component => component[key])
                    .filter(Boolean)
                    .flatten();
            }
        })
    }
}

function MainSMV({ Stage, Model, View }, debug, sources){
    // Set the actors on the stage using the sources.
    const actors = Stage(sources);
    // Model the state using the actors, obtaining the sinks.
    const sinks = Model(actors);
    // Validate that all the sinks are actually streams.
    if (!sinks || sinks.constructor !== Object)
        throw new Error(`Invalid sinks in model`);
    Object.keys(sinks).forEach(key => {
        if (!isStream(sinks[key]))
            throw new Error(`'${key}' is not a valid stream`);
    });
    // DOM and State are special. pars'em.
    let {DOM, State} = sinks;
    // State should be an object containing operators that
    // modify an originally empty state. Rendering on the first operation.
    State = State
        .map(operators => Object
            .keys(operators)
            .map(key => operators[key].map(op => { op.__key = key; return op; }))
        )
        .map(operators => $.merge(...operators))
        .flatten()
        .fold((state, operator) => {
            state = operator(state);
            debug(`State.${operator.__key}`, state);
            return state;
        }, {})
        .drop(1);
    // Once the state has been processed, run DOM operations (if any) on it.
    if (!DOM) return { ...sinks, State, DOM:State.map(state => View(state)) }

    DOM = $
        .combine(State, DOM)
        .map(([state, operators]) => {
            const component$Array = Object
                // An array of functions (operators)
                .values(operators)
                // Every operator should a DOM sink (stream)
                .map(operator => operator(state)
                    .map(dom => {
                        debug(`DOM.${operator.name}`, dom);
                        return { [operator.name]: () => dom };
                    })
                );
            return { state, component$Array }
        })
        .map(({state, component$Array}) => $
            .combine(...component$Array)
            .map(arr => arr.reduce((acc, cur) => Object.assign(acc, cur)), {})
            .map(components => ([state, components]))
        )
        .flatten()
        .map(args => View(...args))

    return { ...sinks, State, DOM }
}

function isStream(subject){
    if (!subject || !subject.constructor) return false;
    const target = subject.constructor;
    if (target !== xsType.stream && target !== xsType.memory) return false;
    return true;
}
