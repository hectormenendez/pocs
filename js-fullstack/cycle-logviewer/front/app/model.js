import $ from 'xstream';

export default function Model({ feather }){

    const state = {
        logs: []
    };

    const operator = {};
    operator.push$ = $
        .merge(feather.init$, feather.created$)
        .map(data => state => ({
            ...state,
            logs: state.logs.concat(data)
        }))

    return {

        State: $
            // Apply all operators.
            .merge(operator.push$)
            .fold((state, operator) => operator(state), state)
            // Always show logs in reverse order
            .map(state => ({ ...state, logs:state.logs.reverse() }))
            .debug(),

        Feathers: $.of({ service:'logs', method:'find', args:[] })
    }
}
