import {html as Html} from 'snabbdom-jsx';
import {Style} from './view.css';

export default (state) => <section className={Style}>
    <h1>Hello {state.subject} !</h1>
</section>
