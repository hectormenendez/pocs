import $ from 'xstream';
import Validate from '../../helpers/validate';

export default function  Stage(sources){

    /*************************************************************************************
     * Properties validation.
     * @todo Add field validation.
     * @todo Validation of operation$ should be done via function.
     ************************************************************************************/
    const prop = Validate(sources.Props, {
        legend: String,
        message: Object,
        fieldset:[Array], // container of fields to show. (required)
        submit: [Object], // representation of a submit button (required)
    })
    if (!prop.submitted$ || prop.submitted$.constructor != $)
        throw new Error(`Expecting a submitted$ prop, got: ${typeof prop.submitted$}`);

    const intent = {};

    /**
     * The intention of submiting the form
     */
    intent.submit$ = sources.DOM
        .select('form > button')
        .events('click')
        // get all the fieldsets on the parent
        .map(e => {
            e.preventDefault()
            const nodes = e.target.parentNode.querySelectorAll('input');
            // convert nodelist to array, and then to an object containing name:value
            return [].slice.call(nodes)
                .map(node => ({ name:node.getAttribute('name'), value:node.value }))
                .reduce((result, item) => ({ ...result, [item.name]:item.value }), {})
        });

    return { prop, intent }
}
