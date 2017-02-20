import { html as Html } from 'snabbdom-jsx';

export default function View(state, {SliderWeight, SliderHeight}) {
    return <section>
        <h1>BMI Calculator</h1>
        <hr/>
        <SliderHeight/>
        <SliderWeight/>
        <h3>Your BMI is: <i style={ {color:'red'} }>{state.bmi}</i></h3>
        <hr/>
        <a href="/examples">Home</a>
    </section>
}
