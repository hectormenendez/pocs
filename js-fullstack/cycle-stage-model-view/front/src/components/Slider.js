import $ from 'xstream';
import { html as Html } from 'snabbdom-jsx';
import { Handler } from '../helpers/smv';

const Stage = (sources) => ({
    intent: {
        /** Props were changed. @todo Validate props here. */
        props$: sources.props,
        /** Slider changed */
        change$: sources.DOM
            .select('input')
            .events('change')
            .map((e) => parseInt(e.target.value, 10)),
    }
});

function Model({ intent }){
    const { props$, change$ } = intent;
    /** emits whenever the props are changed or the input changed */
    const value$ = $.merge(props$.map(({ value }) => value), change$)
    return $
        .combine(props$, value$)
        .map(([props, value]) => ({ ...props, value }))
}

function View(state) {
    const { value, min, max, label, unit } = state;
    return (
        <section>
            <label>{label}: {value}{unit}</label>
            <input type="range" min={min} max={max} value={value} />
        </section>
    )
};

export default Handler({ Stage, Model, View });
