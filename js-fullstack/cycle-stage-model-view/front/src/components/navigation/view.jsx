import {html as Html} from 'snabbdom-jsx';
import Style from './view.css';

export default state => <section>
    <nav role="navigation" className={Style.navigation}>

        {/* Title bar */}
        <h1>{state.title}</h1>

        {/* Hamburguer Icon */}
        <input type="checkbox"/>
        <aside>
            <span/>
            <span/>
            <span/>
        </aside>

        {/* The actual menu */}
        <ul>
            {state.items.map(item => <li>
                <a href={item.href}>{item.title}</a>
            </li>)}
        </ul>
    </nav>
</section>
