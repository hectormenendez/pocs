import $ from 'xstream';

export default function Stage(source){

    const intent = {};

    intent.add$ = source.DOM
        .select('.add')
        .events('keydown')
        .filter(e => e.key === 'Enter')
        .map(e => ({ type: 'add', payload: e.target.value }))

    intent.toggle$ = source.DOM
        .select('.todo > span')
        .events('click')
        .map(e => {
            const payload = parseInt(e.target.parentElement.dataset.index, 10);
            return { type: 'toggle', payload };
        })

    intent.delete$ = source.DOM
        .select('.todo > button')
        .events('click')
        .map(e => {
            const payload = parseInt(e.target.parentElement.dataset.index, 10);
            return { type: 'delete', payload };
        })

    intent.click$ = source.DOM
        .select('a')
        .events('click')
        .map(e => {
            e.preventDefault();
            return e.target.getAttribute('href');
        });

    const sinks = {};
    sinks.Router = intent.click$;

    return { intent, sinks };
}
