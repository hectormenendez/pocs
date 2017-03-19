import $ from 'xstream';

const fieldset = [
    {
        legend: 'Nombre',
        fields: [
            {
                type:'text',
                name:'nameFirst',
                placeholder:'Nombre(s)',
                pattern: '([a-záéíóúüñ]{3,} ?){1,3}',
                required: true,
                value: null,
            },
            {
                type:'text',
                name:'nameLast',
                placeholder:'Apellido(s)',
                pattern: '([a-záéíóúüñ]{3,} ?){1,3}',
                required:true,
                value:null,
            },
        ]
    },
    {
        legend: 'Usuario',
        fields: [
            {
                type:'text',
                name:'userName',
                placeholder:'Nombre de usuario',
                pattern: '[a-z][a-z0-9_.]{3,}',
                required:true,
                value:null,
            },
            {
                type:'password',
                name:'userPassword',
                placeholder:'Contraseña',
                autocomplete:'new-password',
                required: true,
                value:null
            },
        ]
    }
];

export default function Model({ socket, intent }){

    const state = {}; // -----------------------------------------------------------------

    /*
     * The Creation form
     */
    state.form$ = intent.userCreate$
        // Start with default data, and modify it on each intent.
        .fold((form, data) => {
            // Traverse fields to find invalids.
            form.fieldset = form.fieldset.map(({ legend, fields }) => ({
                legend,
                fields: fields.map(field => {
                    // Keep value updated
                    field.value = data[field.name];
                    // Determine if the value is well-formatted or required
                    field.invalid = false;
                    if (field.required && (!field.value || !field.value.length))
                        field.invalid = 'requerido';
                    else if (field.pattern) {
                        const rx = new RegExp('^' + field.pattern.trim() + '$', 'i');
                        const match = field.value.trim().match(rx);
                        if (!match) field.invalid = 'formato';
                    }
                    return field;
                })
            }));
            // The form is ready to be sent.
            form.ready = !form.fieldset
                .map(({ fields }) => fields.map(({ invalid }) => !!invalid))
                .reduce((acc, cur) => acc.concat(cur), [])
                .filter(Boolean)
                .length
            return form;
        }, { ready:false, fieldset })
        // when a user is created, reset the form.
        .map(form => socket.userCreated$
            .mapTo({
                ...form,
                ready:false,
                fieldset: form.fieldset.map(fieldset => ({
                    ...fieldset,
                    fields: fieldset.fields.map(field => ({ ...field, value:'' }))
                }))
            })
            .startWith(form)
        )
        .flatten()

    /*
     * The users table
     */
    state.users$ = socket.users$
        // Apply operattors to the users table whenever a socket event happens.
        .map(users => $
            .merge(
                // when an user is deleted, filter out given id.
                socket.userDeleted$.map(id => users => users.filter(({_id})=> _id != id)),
                // when an user is created, prepend it to the users.
                socket.userCreated$.map(user => users => [user].concat(users))
            )
            .fold((result, op) => op(result), users)
        )
        .flatten()
        // format all users for table display
        .map(users => users.map(user => {
            if (!user.nameFirst || !user.nameLast) user.nameFull = '{?}';
            else user.nameFull = `${user.nameFirst} ${user.nameLast}`
            if (!user.dateCreated) user.dateCreated = '{?}';
            return user;
        }))
        .startWith([])

    const State = $
        .combine(
            state.users$,
            state.form$
        )
        .map(([ users, form ]) => ({ users, form }))
        .debug()


    const feathers = {}; // --------------------------------------------------------------

    // Requests the initial bunch of users.
    feathers.users$ = $.of({
        service:'users',
        method:'find',
        args:[{ query:{ $limit: Infinity } }]
    });

    // Request delete a user
    feathers.userDelete$ = intent.userDelete$
        .map(id => ({
            service:'users',
            method:'remove',
            args:[id, { cascade:true }]
        }));

    // Request the creation of a user
    feathers.userCreate$ = state.form$
        // only when the form is ready
        .filter(form => form.ready)
        // find all fields, convert it to an object, append the creation date.
        .map(({fieldset}) => fieldset
            .map(({fields}) => fields.map(({name, value}) => ({ [name]:value})))
            .reduce((acc,cur) => acc.concat(cur), [])
            .reduce((acc,cur) => Object.assign(acc, cur), {
                dateCreated: new Date().getTime() / 1000
            })
        )
        .map(user => ({
            service: 'users',
            method: 'create',
            args:[user]
        }));

    const Feathers = $
        .merge(
            feathers.users$,
            feathers.userCreate$,
            feathers.userDelete$
        )


    // -----------------------------------------------------------------------------------
    return { State, Feathers }
}
