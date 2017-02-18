import $ from 'xstream';

export default function Stage(source){

    const intent = {}; // --------------------------------------------------------: Intent

    // Link on the bottom, user wants to go back to home.
    intent.goHome$ = source.DOM
        .select('a')
        .events('click')
        .map(e => {
            e.preventDefault();
            return e.target.getAttribute('href');
        });

    // User types a username
    intent.userInput$ = source.DOM
        .select('form input')
        .events('keyup')
        .map(e => e.target.value);

    // Users submits the 'create user' form
    intent.userSubmit$ = source.DOM
        .select('form')
        .events('submit')
        .map(e => {
            e.preventDefault();
            return e.target.querySelector('input').value;
        })

    // User intends to delete an specific user
    intent.userDelete$ = source.DOM
        .select('table button')
        .events('click')
        .map(e => e.target.getAttribute('data-id'))

    const data = {}; // ------------------------------------------------------------: Data

    // data form all the users available
    data.users$ = source.Feathers
        .select({ service: 'users', method: 'find' })
        .map(response => response.data);

    // User was deleted from database
    data.userDeleted$ = source.Feathers
        .select({ service: 'users', method: 'remove' })
        .map(response => response._id)

    const sink = {}; // -----------------------------------------------------------: Sinks

    const feathers = {};

    feathers.users$ = $.of({
        service: 'users',
        method : 'find',
        args   : [ { query: { $limit: Infinity } } ]
    });

    feathers.deleteUser$ = intent.userDelete$
        .map(user => ({
            service: 'users',
            method : 'remove',
            args   : [ user ]
        }));

    // Handles communication with the socket API
    sink.Feathers =  $
        .merge(
            feathers.users$,
            feathers.deleteUser$
        );

    // Handles route clicking
    sink.Router = $
        .merge(intent.goHome$);

    // -----------------------------------------------------------------------------------

    return { intent, sink, data };
}
