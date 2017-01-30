import $ from 'xstream';

export default function(intent, {props$}) {

    // Get the initial value from properties
    const initValue$ = props$
        .map(props => props.value.ini)
        .take(1);

    // The stream contaning future values for the slider
    const currValue$ = intent.sliderValue$
        .startWith(null);

    // The slider value will be either the init value or the current value
    const sliderValue$ = $
        .combine(initValue$, currValue$)
        .map(([init, curr]) => curr || init);

    // The state is the combination of the slider value + props
    const state$ = $
        .combine(props$, sliderValue$)
        .map(([props, value]) => {
            props.value.ini = value;
            return props;
        });

    return state$
}
