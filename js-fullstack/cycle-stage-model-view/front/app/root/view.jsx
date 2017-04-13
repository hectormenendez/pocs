import {html as Html} from 'snabbdom-jsx';
import {Style} from './view.css';

export default ({ subject }, { Slider1, Slider2 }) =>
    <app-root className={Style}>
        <h1>Hello {subject} ! </h1>
        <Slider1/>
        <Slider2/>
    </app-root>
