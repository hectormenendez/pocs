import $ from 'xstream';
import {html as Html} from 'snabbdom-jsx';

export default (state, {Static}) => <section>
    <h1>Hola <Static/> </h1>
    <a href="/todo">Visit the todo Example!</a>
</section>
