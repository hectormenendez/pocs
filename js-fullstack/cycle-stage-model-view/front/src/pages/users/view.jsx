import {html as Html} from 'snabbdom-jsx';
import {Style} from './view.css';

export default ({ table }, { Form }) => <section className={Style}>

    <Form/>
    <section>
        <h3>Lista de usuarios</h3>
        <header>
            {table.head.map(head =>
                <span
                    attrs-data-type={head.type}
                    attrs-data-name={head.name}>
                    {head.legend}
                </span>
            )}
        </header>
        {table.data.map(user =>
            <article attrs-data-id={user._id}>
                {table.head
                    .filter(field => field.type == 'data')
                    .map(field =>
                        <span attrs={field.attrs} attrs-data-name={field.name}>
                            {user[field.name]}
                        </span>
                    )
                }
                <span>
                    <button attrs-data-confirm="¿Borrar usuario?">x</button>
                </span>
            </article>
        )}
    </section>
</section>
