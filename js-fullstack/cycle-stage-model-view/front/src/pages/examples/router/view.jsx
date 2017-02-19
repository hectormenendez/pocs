import $ from 'xstream';
import {html as Html} from 'snabbdom-jsx';

export default (state, {Static}) => <section>
    <h1>Hola <Static/> </h1>
    <ul>
        <li><a href="/todo">Is there something <b>To Do</b> today?</a></li>
        <li><a href="/bmi">Calculate your <b>BMI</b></a></li>
        <li><a href="/socket">A real time user management using <b>Sockets</b></a></li>
    </ul>
</section>
