import $ from 'xstream';

export default function Model({ intent }){

    const form = {};

    form.state = {
        ready: false,
        legend: 'Crear Tipo de cuenta',
        fieldset: [
            {
                legend: null,
                fields: [
                    {
                        type: 'text',
                        name: 'alias',
                        placeholder: 'Alias',
                        pattern: '[a-z\-]{3,}',
                        required: true,
                        value: null,
                    },{
                        type: 'text',
                        name: 'info',
                        placeholder: 'Descripción',
                        pattern: '.{3,30}',
                        required: true,
                        value: null
                    }
                ]
            }
        ]
    };

    const table = {};

    table.state = {
        legend: 'Listado',
        head: [
            {
                name: 'alias',
                legend: 'Alias',
                type: 'data',
            },{
                name: 'info',
                legend: 'Descripción',
                type: 'data',
            },
        ],
        data: []
    }
    return { State: $.of({ form: form.state, table: table.state}) };
}
