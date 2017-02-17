import $ from 'xstream';

export default function Stage(source){

    const intent = {};
    intent.clickHome$ = source.DOM
        .select('a')
        .events('click')
        .map(e => {
            e.preventDefault();
            return e.target.getAttribute('href');
        });

    intent.inputUser$ = source.DOM
        .select('form input')
        .events('keyup')
        .map(e => e.target.value);


    intent.formSubmit$ = source.DOM
        .select('form')
        .events('submit')
        .map(e => {
            e.preventDefault();
            return e.target.querySelector('input').value;
        })

    intent.fetchUsers$ = source.Feathers
        .select({ service: 'users', method: 'find' })
        .map(response => response.data)

    const sink = {};

    // Handles route clicking
    sink.Router = intent.clickHome$;

    const fetchUsers$ = $.of({
        service: 'users',
        method : 'find',
        args   : [ { query: { $limit: Infinity } } ]
    });

    // Handles communication with the socket API
    sink.Feathers =  $.merge(fetchUsers$);

    return { intent, sink };
}
