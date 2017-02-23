import {html as Html} from 'snabbdom-jsx';
import Style from './view.css';

export default (state, {Navigation}) => <section>
    <Navigation/>
    <section className={Style.test}>
        <ul>
            <li> My App </li>
            <li> Create new </li>
            <li attrs-data-name="home"> Home </li>
            <li> About </li>
            <li> News </li>
            <li> Help </li>
        </ul>
    </section>
    <section className={Style.table}>

        <table>
            <caption>This is a caption</caption>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>etor</td>
                    <td>Héctor</td>
                    <td>Menéndez</td>
                </tr>
                <tr>
                    <td>mariela</td>
                    <td>Mariela</td>
                    <td><a href="#">Hola</a></td>
                </tr>
            </tbody>
        </table>
    </section>
</section>
