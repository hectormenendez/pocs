import $ from 'xstream';

export default function Model({ intent, sink }){


    // sink.Feathers =  intent.formSubmit$
    //     .map(user => ({ type: 'create', data: {user} }));
    const state = {
        user  : '',
        users : []
    };

    const user$ = intent.inputUser$
        .map(user => ({ user }))

    const users$ = intent.fetchUsers$
        .map(users => ({users}))

    const formSubmitted$ = intent.formSubmit$
        .map(user => ({ user: '' }));

    const state$ = $
        .merge(
            user$,
            users$,
        )
        .fold((state, cur) => Object.assign(state, cur), state)
        .drop(1)
        .debug();

    return { vnode$: $.of({}) , state$ }
}
