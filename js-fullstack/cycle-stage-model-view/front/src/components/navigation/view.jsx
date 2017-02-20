import {html as Html} from 'snabbdom-jsx';
import Style from './view.css';

export default state => <section>
    <nav role="navigation" className={Style.navigation}>

        {/* Title bar */}
        <h1>Money</h1>

        {/* Hamburguer Icon */}
        <input type="checkbox"/>
        <aside>
            <span/>
            <span/>
            <span/>
        </aside>

        {/* The actual menu */}
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Home</a></li>
            <li><a href="#">Home</a></li>
        </ul>
    </nav>
</section>
