import $ from 'xstream';
import Debug from 'debug';

export default function Model({ feather, intent }){

    const debug = Debug('app:model');
    const state = {
        loaded: false,
        fields:[],
        logs: []
    };

    const operator = {};

    operator.init$ = feather.init$
        .map(logs => state => ({ ...state, logs, loaded:true }))

    operator.reset$ = intent.reset$
        .map(() => state => ({ ...state, logs:[], loaded:false }))

    operator.filter$ = intent.filter$
        .map(({ val, key }) => state => ({
            ...state,
            logs: state.logs.filter(function(log){
                const orig = String(log[key]).toLowerCase();
                const comp = String(val).toLowerCase();
                return orig.indexOf(comp) !== -1;
            })
        }));

    operator.created$ = feather.created$
        .map(data => state => ({ ...state, logs: [data].concat(state.logs) }))

    const State = $
        // run all operators against the state
        .merge(
            operator.init$,
            operator.created$,
            operator.filter$
        )
        .fold((state, operator) => operator(state), state)
        // Determine the fields from the unique properties found on the logs.
        .map(state => {
            const fields = state.logs
                .map(log => Object.keys(log).filter(key => key !== '_id'))
                .reduce((acc, key) => acc.concat(key), []);
            state.fields = [...new Set(fields)];
            return state;
        })
        .debug(state => debug('State', state));

    const Feathers = intent.reset$
        .fold(request => request, { service:'logs', method:'find', args:[] })
        .debug(feathers => debug('Feathers', feathers));

    return { State, Feathers };
}
