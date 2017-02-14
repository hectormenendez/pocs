import { html as Html } from 'snabbdom-jsx';
import Style from './view.css';

export default state => <section className={Style.socket}>
    <header>
        <h1>Socket User Management</h1>
    </header>

    <form>
        <label>Create User</label>
        <input type="text" placeholder="Name" />
        <button> ok </button>
    </form>

    <table>
        <thead>
            <tr>
                <th> Name </th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td> Hector </td>
                <td> <button>x</button> </td>
            </tr>
        </tbody>
    </table>

    <footer>
        <a href="/">Home</a>
    </footer>
</section>
