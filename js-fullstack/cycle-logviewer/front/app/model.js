import $ from 'xstream';
import Debug from 'debug';

export default function Model({ intent }){

    const debug = Debug('app:model');
    let when;

    // The default state
    const state = {
        loaded: false,
        detail: null,
        filter: null,
        fields: [],
        logs: [],
    };


    /*************************************************************************************
     * State sink.
     ************************************************************************************/
    const modifyWhen = {};

    // Whenever logs are loaded replace'em completely on the state.
    modifyWhen.logsLoaded$ = intent.logsLoaded$
        .map(logs => state => ({ ...state, loaded:true, logs, fields:getFields(logs) }));

    // Whenever logs are needed, empty the logs on the state.
    modifyWhen.logsNeeded$ = $
        .merge(intent.logsNeeded$, intent.filterNeeded$)
        .map(() => state => ({ ...state, loaded:false, logs:[], fields:[] }));

    // Whenever new logs are created, prepend'em to the state.
    modifyWhen.logsCreated$ = intent.logsCreated$
        .map(log => state => {
            const logs = [log].concat(state.logs);
            return { ...state, logs, fields:getFields(logs) }
        });

    // Whenever a detail is loaded, replace it on the state.
    modifyWhen.detailLoaded$ = intent.detailLoaded$
        .map(detail => state => ({ ...state, detail }));

    // Whenever a detail is hidden, reset back to null the state.
    modifyWhen.detailHidden$ = intent.detailHidden$
        .map(() => state => ({ ...state, detail:null }));

    // Whenever a filter input is focused or blurred, upate its 'active' state.
    modifyWhen.filterChangedFocus$ = intent.filterChangedFocus$
        .map(data => state =>  ({
            ...state,
            fields: state.fields.map(field => {
                if (field.name != data.name) return field;
                return Object.assign({}, field, data);
            })
        }));

    const State = $
        .merge(...Object.values(modifyWhen))
        .fold((state, when) => when(state), state)
        .debug(state => debug('State', state));


    /*************************************************************************************
     * Feathers sink.
     ************************************************************************************/
    const requestWhen = {};

    // Whenever logs are needed, request the server to find'em.
    requestWhen.logsNeeded$ = intent.logsNeeded$
        .fold(request => request, { service:'logs', method:'find', args:[] });

    // Whenever a detail is needed, request the server to corresponding ID.
    requestWhen.detailNeeded$ = intent.detailNeeded$
        .map(id => ({ service:'logs', method:'get', args:[id] }));

    requestWhen.filterNeeded$ = intent.filterNeeded$
        // convert the input information into a query
        .map(fields => fields.reduce((query, { name, value }) => ({
            ...query,
            [name]: { $search:value },
        }), {}))
        .map(query => ({ service: 'logs', method: 'find', args: [{ query }] }));

    const Feathers = $
        .merge(...Object.values(requestWhen))
        .debug(feathers => debug('Feathers', feathers));


    /************************************************************************************/
    return { State, Feathers };
}

/**
 * Determine available fields on an array of logs.
 */
function getFields(logs){
    // get all field names from the logs
    const fields = logs
        .map(log => Object
             .keys(log)
             .filter(name => name !== '_id')
        )
        .reduce((acc, name) => acc.concat(name), []);
    // only leave those that are unique and convert'em to an object.
    return [...new Set(fields)]
        .map(name => ({ name, value:null }));
}
