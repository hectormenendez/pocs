import {html as Html} from 'snabbdom-jsx';

export default ({routes}) => <app-root>
    <header>
        <h1>Cycle Example</h1>
        <nav><ul>
            {routes.map(({href,title}) => <li><a href={href}>{title}</a> </li>)}
        </ul></nav>
    </header>
    <footer>
        <h6>I am a footer</h6>
    </footer>
</app-root>
