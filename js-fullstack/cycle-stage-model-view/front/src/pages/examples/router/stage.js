import $ from 'xstream';

export default function Intent(source){

    const target = {};
    target.link  = source.DOM.select('a');

    const intent = {};
    intent.linkClicked$ = target.link.events('click')
        .map(e => {
            e.preventDefault();
            return e.target.getAttribute('href');
        })
        .debug()

    const sink = {};
    sink.Router = intent.linkClicked$;

    return { intent, sink };
}
