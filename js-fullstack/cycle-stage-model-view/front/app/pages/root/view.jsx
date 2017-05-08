import {html as Html} from 'snabbdom-jsx';
import {Style} from './view.css';

export default ({ subject, routes }) =>
    <app-root className={Style}>
        <h1>Hello {subject} !!</h1>
        <ul>
            {routes.map(({legend, href}) => <li>
                <a href={href}>{legend}</a>
            </li>)}
        </ul>
    </app-root>
