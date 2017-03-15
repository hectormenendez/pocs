import {html as Html} from 'snabbdom-jsx';

import Style from './view.css';

export default (state, {Navigation}) =>
    <section>
        <Navigation/>
        <section className={Style.home}>
            <a href="#/cuentas" className={Style.button}>Cuentas</a>
            <a href="#/movs" className={Style.button}>Movs</a>
        </section>
    </section>
