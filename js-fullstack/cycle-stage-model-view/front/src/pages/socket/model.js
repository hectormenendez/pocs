import $ from 'xstream';

export default function Model({ intent, data, sink }){

    // The initial state
    const initial = {
        user             : '',
        users            : [],
        creationDisabled : false
    };

    // Operations done to the user array
    const usersmod = {
        delete$: data.userDeleted$,
            // .map(_id => users => users.filter(user => user._id  !== _id)),
        create$: data.userCreated$
            // .map(user => users => [user].concat(users)),
    };

    const state = {};

    // fetch all users, then apply operators to modify the original array.
    state.users$ = data.users$
        .map(users => $
            .merge(...Object.keys(usersmod).map(k => usersmod[k]))
            .fold((users, mod) => mod? mod(users) : users, users)
        )
        .flatten()
        .map(users => ({ users }))

    // when the input for user creation changes
    state.userInput$ = intent.userInput$
        .map(user => ({ user }))

    // reset the input whenever the form is submitted
    state.userSubmit$ = intent.userSubmit$
        .map(user => ({ user: '' }));

    return $
        .merge(...Object.keys(state).map(k => state[k]))
        .fold((state, cur) => Object.assign(state, cur), initial)
        // Post operations to state
        .map(state => ({
            ...state,
            creationDisabled: !(state.user.length > 3)
        }));

}
