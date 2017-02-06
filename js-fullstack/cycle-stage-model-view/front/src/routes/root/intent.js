import $ from 'xstream';

export default ({dom, socket}) => ({

    // Future intention of getting the count of all users
    getUserCountStream: () => socket
        .select('users')
        .find({ query: { $limit: 0 } }),

    // Future intention of creating an user
    getUserCreateStream: user => socket
        .select('users')
        .create(user),

    getUserLoadStream: id => socket
        .select('users')
        .get(id),

    // Intention of updating the user list
    usersUpdate$: $
        .merge(
            $.of(true),                              // When the page loads
            socket.select('users').events('created') // When a new user is created
        )
        .debug(x => console.log('» intent» stateUpdate$', x)),

    // Intend to create a user whenever the input is not empty
    // and the OK button is clicked
    usersCreate$: dom
        .select('.creator button')
        .events('click')
        .map(e => e.target.parentNode.querySelector('input').value)
        .debug(x => console.log('» intent» usersCreate$', x)),

});
