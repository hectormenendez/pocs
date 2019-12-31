import { html as Html } from 'snabbdom-jsx';
import Style from './view.css';

export default state => <section className={Style.socket}>
    <header>
        <h1>Socket User Management</h1>
    </header>
    <form>
        <label>Create User</label>
        <input
            type        = "text"
            placeholder = "Name"
            value       = {state.user}/>
        <button
            type     = "submit"
            disabled = {state.creationDisabled}>
            OK
        </button>
    </form>

    <table>
        <thead>
            <tr>
                <th> Name </th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            { state.users.map(user => <tr>
                <td> {user.name} </td>
                <td>
                    <button attrs-data-id={user._id}>x</button>
                </td>
            </tr> )}
        </tbody>
    </table>

    <footer>
        <a href="/">Home</a>
    </footer>
</section>
