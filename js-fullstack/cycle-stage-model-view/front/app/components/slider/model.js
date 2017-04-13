import $ from 'xstream';

export default ({ intent, prop, debug }) => ({

    State: $.of({
        // Whenever the component is initialized, set the props as the default state.
        initial$: $.of(state => Object.assign({}, prop)),
        // Whenever a new value arrives from the slided intention
        // convert it to a number and set it to state.
        slided$: intent.slided$
            .map(value => state => ({ ...state, value:parseInt(value, 10) })),
    })

});
