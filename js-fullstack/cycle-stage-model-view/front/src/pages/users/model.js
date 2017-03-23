import $ from 'xstream';

export default function Model({ socket, intent, component }){

    /*************************************************************************************
     * The Creation form
     ************************************************************************************/
    const form = component.form({
        legend: 'Crear usuario',
        message: {
            pattern: 'formato',
            required: 'requerido',
        },
        submit: { legend:'Crear' },
        submitted$: socket.userCreated$,
        fieldset: [
            {
                legend: 'Datos Personales',
                fields: [
                    {
                        type: 'text',
                        name: 'namefirst',
                        placeholder: 'Nombre(s)',
                        pattern: '([a-záéíóúüñ]{3,} ?){1,3}',
                        required: true,
                        value: null,
                    }, {
                        type: 'text',
                        name: 'namelast',
                        placeholder: 'Apellido(s)',
                        pattern: '([a-záéíóúüñ]{3,} ?){1,3}',
                        required: true,
                        value: null,
                    },
                ]
            }, {
                legend: 'Usuario',
                fields: [
                    {
                        type: 'email',
                        name: 'email',
                        placeholder: 'Correo Electrónico',
                        pattern: '.+@.+',
                        required: true,
                        value: null,
                    }, {
                        type: 'text',
                        name: 'alias',
                        placeholder: 'Alias',
                        pattern: '[a-z][a-z0-9_.]{3,}',
                        required: true,
                        value: null,
                    }, {
                        type: 'password',
                        name: 'password',
                        placeholder: 'Contraseña',
                        autocomplete: 'new-password',
                        required: true,
                        value: null
                    },
                ]
            }
        ]
    });

    /*************************************************************************************
     * The users table
     ************************************************************************************/
    const table = {};

    table.state = {
        head: [
            {
                name: 'alias',
                legend: 'Alias',
                type: 'data',
                attrs: { 'data-editable': true },
            }, {
                name: 'namefirst',
                legend: 'Nombre',
                type: 'data',
                attrs: { 'data-editable': true },
            }, {
                name: 'namelast',
                legend: 'Apellido',
                type: 'data',
                attrs: { 'data-editable': true },
            }, {
                name: 'email',
                legend: 'Correo',
                type: 'data',
                attrs: { 'data-editable': true },
            }, {
                name: 'actions',
                legend: 'Acciones',
                type: 'nodes'
            },
        ],
        data: []
    };

    table.state$ = $
        .merge(
            // The intial load of users. A simple return.
            socket.users$.map(data => table => ({ ...table, data })),
            // When user deleted, filter it out from the array using its ID.
            socket.userDeleted$.map(id => table => ({
                ...table,
                data: table.data.filter(user => user._id != id)
            })),
            // When user created. prepend it to the array.
            socket.userCreated$.map(user => table => ({
                ...table,
                data: [user].concat(table.data)
            }))
        )
        .fold((state, operator) => operator(state), table.state);

    /*************************************************************************************
     * The Feathers stream: Operations for the socket server.
     ************************************************************************************/

    const feathers = {}; // --------------------------------------------------------------

    // Requests the initial bunch of users.
    feathers.users$ = $.of({
        service: 'users',
        method: 'find',
        args: [{ query:{ $limit: Infinity } }]
    });

    // Request delete a user
    feathers.userDelete$ = intent.userDelete$
        .map(id => ({
            service: 'users',
            method: 'remove',
            args: [id, { cascade:true }]
        }));

    // Request the creation of a user
    feathers.userCreate$ = form.State
        // only when the form is ready
        .filter(form => form.ready)
        // find all fields, convert it to an object, append the creation date.
        .map(({fieldset}) => fieldset
            .map(({fields}) => fields.map(({name, value}) => ({ [name]: value})))
            .reduce((acc,cur) => acc.concat(cur), [])
            .reduce((acc,cur) => Object.assign(acc, cur), {
                datecreated: new Date().getTime() / 1000
            })
        )
        .map(user => ({
            service: 'users',
            method: 'create',
            args: [user]
        }));

    const Feathers = $
        .merge(
            feathers.users$,
            feathers.userCreate$,
            feathers.userDelete$
        )

    /*************************************************************************************
     * Sinks
     ************************************************************************************/
    return {
        Feathers,
        State: $
            .combine(table.state$)
            .map(([table]) => ({ table })),
        DOM: $
            // Combine all components, and convert them to an object.
            .combine(form.DOM)
            .map(([Form]) => ({ Form }))
            // For convenience, convert each vnode to a function so it can be uses as JSX.
            .map(nodes => Object
                .keys(nodes)
                .reduce((vtree, name) => ({ ...vtree, [name]: () => nodes[name] }), {})
            )
    }
}
