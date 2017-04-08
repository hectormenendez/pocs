import $ from 'xstream';
import Debug from 'debug';

export default function Model({ intent }){

    const debug = Debug('app:model');
    const state = { loaded:false, detail:null, fields:[], logs:[] };

    const modifyWhen = {};

    // Whenever logs are loaded replace'em completely on the state.
    modifyWhen.logsLoaded$ = intent.logsLoaded$
        .map(logs => state => ({ ...state, logs, loaded:true }));

    // Whenever logs are needed, empty the logs on the state.
    modifyWhen.logsNeeded$ = intent.logsNeeded$
        .map(() => state => ({ ...state, logs:[], loaded:false }));

    // Whenever new logs are created, prepend'em to the state.
    modifyWhen.logsCreated$ = intent.logsCreated$
        .map(data => state => ({ ...state, logs: [data].concat(state.logs) }));

    // Whenever a detail is loaded, replace it on the state.
    modifyWhen.detailLoaded$ = intent.detailLoaded$
        .map(detail => state => ({ ...state, detail }));

    // Whenever a detail is hidden, reset back to null the state.
    modifyWhen.detailHidden$ = intent.detailHidden$
        .map(() => state => ({ ...state, detail:null }));


    const requestWhen = {};

    // Whenever logs are needed, request the server to find'em.
    requestWhen.logsNeeded$ = intent.logsNeeded$
        .fold(request => request, { service:'logs', method:'find', args:[] });

    // Whenever a detail is needed, request the server to corresponding ID.
    requestWhen.detailNeeded$ = intent.detailNeeded$
        .map(id => ({ service:'logs', method:'get', args:[id] }));

    return {

        // The state stream to be sent to the view.
        State: $
            // run all modifiers against the state.
            .merge(...Object.values(modifyWhen))
            .fold((state, when) => when(state), state)
            // Determine the fields from the unique properties found on the logs.
            .map(state => {
                const fields = state.logs
                    .map(log => Object.keys(log).filter(key => key !== '_id'))
                    .reduce((acc, key) => acc.concat(key), []);
                state.fields = [...new Set(fields)];
                return state;
            })
            .debug(state => debug('State', state)),

        // The object stream to be sent to the Feathers Driver.
        Feathers: $
            .merge(...Object.values(requestWhen))
            .debug(feathers => debug('Feathers', feathers))
    }
}
