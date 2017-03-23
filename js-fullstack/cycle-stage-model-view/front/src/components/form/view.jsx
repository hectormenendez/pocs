import {html as Html} from 'snabbdom-jsx';
import {Style} from'./view.css';

export default ({legend, fieldset, submit, ready}) => <form className={Style}>
    { legend? <label>{legend}</label>: null}
    <div>
        {fieldset.map(({ legend, fields }) => <fieldset>
            {legend? <legend>{legend}</legend> : ''}
            {fields.map(field => <span
                attrs={field.invalid? {invalid:field.invalid} : {}}>
                { ['text', 'email', 'password'].indexOf(field.type) === -1? '' : <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={field.value}
                    disabled={ready}
                />}
            </span>)}
        </fieldset>)}
    </div>
    <button attrs={submit.attrs}>{submit.legend}</button>
</form>
