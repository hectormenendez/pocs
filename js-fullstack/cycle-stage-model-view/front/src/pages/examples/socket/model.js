import $ from 'xstream';

export default function Model({ intent, data, sink }){

    const state = {
        user             : '',
        users            : [],
        creationDisabled : false
    };

    // Operations done to the user array
    const userOp = {};

    userOp.delete$ = data.userDeleted$
        .map(_id => users => users.filter(user => user._id  !== _id))

    const users$ = data.users$
        .map(users => $
            .merge(userOp.delete$)
            .startWith(null)
            .fold((users, op) => op? op(users) : users, users)
        )
        .flatten()
        .map(users => ({ users }))

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
            userSubmitted$,
            data.userDeleted$
        )
        .fold((state, cur) => Object.assign(state, cur), state)
        .map(state => ({
            ...state,
            creationDisabled: !(state.user.length > 3)
        }))

    return { vnode$: $.of({}) , state$ }
}
