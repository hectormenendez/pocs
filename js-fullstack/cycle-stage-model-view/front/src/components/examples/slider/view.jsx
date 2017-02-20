import {html as Html} from 'snabbdom-jsx';

export default state => <section>
    <label>{state.type} {state.value} {state.unit} </label>
    <input type="range" min={state.min} max={state.max} value={state.value} />
</section>
