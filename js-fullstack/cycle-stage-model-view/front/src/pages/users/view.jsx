import {html as Html} from 'snabbdom-jsx';
import Style from './view.css';

export default ({ form, users})=>
<section>

    <form className={Style.form}>
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
        <button disabled={form.ready}>Crear</button>
    </form>

    {!users.length? '' : <section className={Style.table}>
        <header>
            <span>Creación</span>
            <span>Nombre</span>
            <span>Alias</span>
            <span>Acción</span>
        </header>
        { users.map(user =>
            <article attrs-data-id={user._id}>
                <span>{user.dateCreated}</span>
                <span>{user.nameFull}</span>
                <span>{user.userName}</span>
                <span>
                    <button attrs-data-confirm="¿Borrar usuario?">x</button>
                </span>
            </article>
        )}
    </section>}

</section>
