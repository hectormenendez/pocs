import $ from 'xstream';
import Debug from 'debug';

export default function Model({ intent }){

    const debug = Debug('app:model');
    const state = {
        loaded: false,
        detail:null,
        fields:[],
        logs: []
    };

    const operator = {};
    operator.load$ = intent.load$
        .map(logs => state => ({ ...state, logs, loaded:true }));
    operator.reset$ = intent.reset$
        .map(() => state => ({ ...state, logs:[], loaded:false }));
    operator.filter$ = intent.filter$
        .map(({ val, key }) => state => ({
            ...state,
            logs: state.logs.filter(function(log){
                const orig = String(log[key]).toLowerCase();
                const comp = String(val).toLowerCase();
                return orig.indexOf(comp) !== -1;
            })
        }));
    operator.append$ = intent.append$
        .map(data => state => ({ ...state, logs: [data].concat(state.logs) }));
    operator.detailShow$ = intent.detailShow$
        .map(detail => state => ({ ...state, detail }));
    operator.detailHide$ = intent.detailHide$
        .map(() => state => ({ ...state, detail:null }));


    const State = $
        // run all operators against the state
        .merge(
            operator.load$,
            operator.append$,
            operator.filter$,
            operator.detailShow$,
            operator.detailHide$,
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


    const request = {};
    request.reset$ = intent.reset$
        .fold(request => request, { service:'logs', method:'find', args:[] });
    request.detail$ = intent.detailRequest$
        .map(id => ({ service:'logs', method:'get', args:[id] }));

    const Feathers = $
        .merge(
            request.reset$,
            request.detail$,
        )
        .debug(feathers => debug('Feathers', feathers));


    return { State, Feathers };
}
