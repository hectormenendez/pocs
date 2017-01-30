import {html as Html} from 'snabbdom-jsx';
// import Style from './view.css';

export default function (state$) { return state$.map(state =>

    <section className="labeled-slider">
        <label className="label">{state.label} {state.value.ini}{state.units}</label>
        <input
            className = "slider"
            type      = "range"
            min       = {state.value.min}
            max       = {state.value.max}
            value     = {state.value.ini}
        />
    </section>

)}
