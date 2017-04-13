import {html as Html} from 'snabbdom-jsx';

export default ({ label, value, min, max }) =>
    <component-slider>
        {label? <label>{label}</label> : ''}
        <input type="range" min={min} max={max} value={value}/>
    </component-slider>
