import $ from 'xstream';

export default function Stage(source){

    const intent = {};
    intent.click$ = source.DOM
        .select('a')
        .events('click')
        .map(e => {
            e.preventDefault();
            return e.target.getAttribute('href');
        });

    const sink = {};
    sink.Router = intent.click$;

    return { sink };
}
