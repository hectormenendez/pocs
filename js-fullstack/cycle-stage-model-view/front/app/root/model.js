import $ from 'xstream';

export default ({ intent, debug, component }) => ({

    State:$.of({
        initial$: $.of(state => ({
            subject:'World',
            slider: {
                value: 10
            }
        })),
    }),

    DOM:$.of({
        Slider1: state => component.slider(state.slider).DOM,
        Slider2: state => component.slider(state.slider).DOM,
    })
})
