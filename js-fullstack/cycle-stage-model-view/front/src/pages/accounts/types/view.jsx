import {html as Html} from 'snabbdom-jsx';

export default ({ form, table }) => <section>
    <form>
        <h3>{form.legend}</h3>
        <div>
            {form.fieldset.map(({ legend, fields }) => <fieldset>
                { !legend? '' : <legend>{legend}</legend> }
                { fields.map(field =>
                    <span attrs={ !field.invalid? {} : { invalid: field.invalid } }>
                        { Html('input', { ...field, disabled: form.ready }) }
                    </span>
                )}
            </fieldset>)}
        </div>
        <button disabled={form.ready}>Crear</button>
    </form>

    <section>
        <h3>{table.legend}</h3>
        <header>
            {table.head.map(head =>
                <span
                    attrs-data-type={head.type}
                    attrs-data-name={head.name}>
                    {head.legend}
                </span>
            )}
        </header>
        {table.data.map(data =>
            <article attrs-data-id={data._id}>
                {table.head
                    .filter(head => head.type == 'data')
                    .map(field =>
                        <span attrs={field.attrs} attrs-data-name={field.name}>
                            {data[field.name]}
                        </span>
                    )
                }
                <span>
                    <button attrs-data-confirm="¿Borrar tipo de cuenta?">x</button>
                </span>
            </article>
        )}
    </section>

</section>
