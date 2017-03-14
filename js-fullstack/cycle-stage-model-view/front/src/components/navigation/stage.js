import $ from 'xstream';

export default function Stage(source){

    // A props stream must be sent
    const { props$ } = source;
    if (!props$ || props$.constructor !== $)
        throw new TypeError(`Invalid props$, got: ${typeof props$}`);

    const intent = {};
    intent.linkClicked$ = source.DOM
        .select('a')
        .events('click')
        .filter(e => e.target.getAttribute('href').slice(0,1) == '#')
        .map(e => {
            e.preventDefault();
            console.log('->');
            return e.target.getAttribute('href').slice(1);
        });

    const sink = {};
    sink.Router = intent.linkClicked$;

    return { props$, sink, intent };
}
