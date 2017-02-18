import $ from 'xstream';

export default function Model({ intent, data, sink }){

    const state = {
        user             : '',
        users            : [],
        creationDisabled : false
    };

    // whenever user data arrives
    const users$ = data.users$
        .map(users => ({users}))

    // when the input for user creation is greater than 4 chars
    const userTyped$ = intent.userInput$
        .map(user => ({ user }))

    // reset the input form whenever the form is submitted
    const userSubmitted$ = intent.userSubmit$
        .map(user => ({ user: '' }));

    const state$ = $
        .merge(
            users$,
            userTyped$,
            userSubmitted$
        )
        .fold((state, cur) => Object.assign(state, cur), state)
        .map(state => ({
            ...state,
            creationDisabled: !(state.user.length > 3)
        }))
        .debug();

    return { vnode$: $.of({}) , state$ }
}
