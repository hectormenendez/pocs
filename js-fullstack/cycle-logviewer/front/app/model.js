import $ from 'xstream';

export default function Model({ feather, intent }){

    const state = {
        logs: []
    };

    const operator = {};

    operator.insert$ = $
        .merge(feather.init$, feather.created$)
        .map(data => state => ({ ...state, logs: data.concat(state.logs) }))

    operator.filter$ = intent.filter$
        .map(({value, name}) => state => ({
            ...state,
            logs: state.logs.filter(function(log){
                const orig = String(log[name]).toLowerCase();
                const comp = String(value).toLowerCase();
                return orig.indexOf(comp) !== -1;
            })
        }))

    return {
        // Apply all operators.
        State: $
            .merge(
                operator.insert$,
                operator.filter$
            )
            .fold((state, operator) => operator(state), state)
            .map(state => {
                const fields = state.logs
                    .map(log => Object.keys(log).filter(key => key !== '_id'))
                    .reduce((acc, key) => acc.concat(key), []);
                state.fields = [...new Set(fields)];
                return state;
            })
            .debug(),

        // Send all requests to socket server
        Feathers: $.of({ service:'logs', method:'find', args:[] })
    }
}
