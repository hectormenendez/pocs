import {html as Html} from 'snabbdom-jsx';

import Style from './view.css';

export default (state, {Navigation}) => <section>
    <Navigation/>
    <ul>
        <li><a href="#/examples/todo">todo</a></li>
        <li><a href="http://google.com">google</a></li>
    </ul>
</section>
