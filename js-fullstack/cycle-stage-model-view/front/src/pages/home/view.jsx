import {html as Html} from 'snabbdom-jsx';

import Style from './view.css';

export default (state, {Navigation}) => <section>
    <Navigation/>
    <section className={Style['ui-table']}>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Jim</td>
                    <td>Kirk</td>
                    <td>@captaink</td>
                </tr>
                <tr>
                    <td>Mr.</td>
                    <td>Spock</td>
                    <td>@sciencie101</td>
                </tr>
                <tr>
                    <td>Nyota</td>
                    <td>Uhura</td>
                    <td>@comms</td>
                </tr>
            </tbody>
        </table>
    </section>
</section>
