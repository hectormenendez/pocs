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

    const data = {}; // ------------------------------------------------------------: Data

    // data form all the users available
    data.users$ = source.Feathers
        .select({ service: 'users', method: 'find' })
        .map(response => response.data)

    const sink = {}; // -----------------------------------------------------------: Sinks

    const feathers = {};

    feathers.users$ = $.of({
        service: 'users',
        method : 'find',
        args   : [ { query: { $limit: Infinity } } ]
    });

    // Handles communication with the socket API
    sink.Feathers =  $
        .merge(feathers.users$);

    // Handles route clicking
    sink.Router = $
        .merge(intent.goHome$);

    // -----------------------------------------------------------------------------------

    return { intent, sink, data };
}
