import $ from 'xstream';
import { html as Html } from 'snabbdom-jsx';
import ComponentSlider from '../components/Slider';

const Stage = (sources) => ({
    state: {
        bmi: null,
        weight: {
            min: 80,
            max: 120,
            value: 90,
            label: 'Weight',
            unit: 'kg',
        },
        height: {
            min: 130,
            max: 230,
            value: 165,
            label: 'Height',
            unit: 'cm',
        }
    },
    /** @returns {Function} An SMV of the SliderComponent. */
    getComponentSlider: (props) => ComponentSlider({ ...sources, props: $.of(props) }),
    /** @returns {number} The BMI, given a weight and a height. */
    setBMI: (state) => {
        const { weight: { value: weight }, height: { value: height } } = state;
        const bmi = Math.round(weight / ((height * 0.01) ** 2))
        return { ...state, bmi };
    },
});

function Model(staged) {
    const { state, getComponentSlider, setBMI } = staged;
    const { DOM: sliderW$, State: stateW$ } = getComponentSlider(state.weight);
    const { DOM: sliderH$, State: stateH$ } = getComponentSlider(state.height);
    const state$ = $
        .merge(
            stateH$.map((height) => ({ height })),
            stateW$.map((weight) => ({ weight }))
        )
        // Everytime a state changes, generate a new state with BMI calculated.
        .fold((acc, cur) => setBMI({ ...acc, ...cur }), setBMI(state));
    const component$ = $
        .combine(sliderW$, sliderH$)
        .map(([sliderW, sliderH]) => ({ sliderW, sliderH }))
    return $
        .combine(component$, state$)
        .map(([component, state]) => ({ component, state }))
}


function View({ state, component }) {
    const { sliderW, sliderH } = component;
    const { bmi } = state;
    return (
        <section>
            {sliderH}
            {sliderW}
            <h3>BMI: {bmi}</h3>
        </section>
    )
};


export default { Stage, Model, View };