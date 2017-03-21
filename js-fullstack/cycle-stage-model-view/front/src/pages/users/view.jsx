import {html as Html} from 'snabbdom-jsx';
import Style from './view.css';

export default ({ form, table }) => <section className={Style.users}>

    <form className={Style.form}>
        <h3>{form.legend}</h3>
        <div>
            {form.fieldset.map(({ legend, fields })=>
                <fieldset>
                    <legend>{ legend }</legend>
                    {fields.map(field =>
                        <span attrs={field.invalid? {invalid:field.invalid} : {}}>
                            { Html('input', { ...field, disabled:form.ready }) }
                        </span>
                    )}
                </fieldset>
            )}
        </div>
        <button disabled={form.ready}>Crear</button>
    </form>
    <section className={Style.table}>
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
