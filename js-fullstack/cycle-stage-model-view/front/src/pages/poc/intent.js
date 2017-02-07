import $ from 'xstream';

export default ({DOM, Feathers}) => ({

    // Future intention of getting the count of all users
    getUserCountStream: () => Feathers
        .select('users')
        .find({ query: { $limit: 0 } }),

    // Future intention of creating an user
    getUserCreateStream: user => Feathers
        .select('users')
        .create(user),

    getUserLoadStream: id => Feathers
        .select('users')
        .get(id),

    // Intention of updating the user list
    usersUpdate$: $
        .merge(
            $.of(true),                                // When the page loads
            Feathers.select('users').events('created') // When a new user is created
        )
        .debug(x => console.log('» intent» stateUpdate$', x)),

    // Intend to create a user whenever the input is not empty
    // and the OK button is clicked
    usersCreate$: DOM
        .select('.creator button')
        .events('click')
        .map(e => e.target.parentNode.querySelector('input').value)
        .debug(x => console.log('» intent» usersCreate$', x)),

});
