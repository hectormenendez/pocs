import $ from 'xstream';

export default function Model({ prop, intent }){

    /*************************************************************************************
     * The initial state.
     ************************************************************************************/
    const state = {
        ready: false, // wether the form is ready to be sent.
        legend: prop.legend, // A title to be shown for the form.
        fieldset: prop.fieldset, // A fieldset containing fields declarations.
        submit: prop.submit, // A submit button declaration.
        message: { // Messages to be shown when inputs are not valid.
            required: prop.message? prop.message.required : 'required',
            pattern: prop.message ? prop.message.pattern : 'pattern',
        }
    };

    /*************************************************************************************
     * The submitted intent stream.
     * - It tells the form when the form has been submitted, so it can reset itself.
     ************************************************************************************/
    const submitted$ = prop.submitted$.map(() => form => ({
        ...form,
        ready: false,
        fieldset: form.fieldset.map(fieldset => ({
            ...fieldset,
            fields: fieldset.fields.map(field => ({ ...field, value: '' }))
        }))
    }));

    /*************************************************************************************
     * The sumbit intention stream.
     * - Everytime the form is submitted, validate the fields.
     * - Invalid fields will be marked using the data-invalid attribute.
     * - This just an applied operator. if you're building your own use it as an example.
     ************************************************************************************/
    const submit$ = intent.submit$.map(data => state => {
        // Traverse fields to find invalids.
        state.fieldset = state.fieldset.map(fieldset => ({
            ...fieldset,
            fields: fieldset.fields.map(field => {
                // Update value from arriving data.
                field.value = data[field.name];
                // Determine if the value is well-formatted or required
                field.invalid = false;
                if (field.required && (!field.value || !field.value.length))
                    field.invalid = state.message.required;
                else if (field.pattern) {
                    const rx = new RegExp('^' + field.pattern.trim() + '$', 'i');
                    if (!field.value.trim().match(rx))
                        field.invalid = state.message.pattern;
                }
                return field;
            })
        }));
        // Determine if the form is ready to be sent. (no invalid fields found)
        state.ready = !state.fieldset
            .map(({ fields }) => fields.map(({ invalid }) => !!invalid))
            .reduce((acc, cur) => acc.concat(cur), [])
            .filter(Boolean)
            .length
        return state;
    });

    return {
        State: $
            .merge(submit$, submitted$)
            .fold((state, operator) => operator(state), state),
    }
}
