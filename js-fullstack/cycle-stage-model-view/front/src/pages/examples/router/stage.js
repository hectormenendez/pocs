import $ from 'xstream';

import Static from '../../../components/examples/static';

export default function Stage(source){

    const component = {};
    component.static = props => Static(Object.assign({ props: $.of(props) }, source));

    const intent = {};
    intent.linkClicked$ = source.DOM
        .select('a')
        .events('click')
        .map(e => {
            e.preventDefault();
            return e.target.getAttribute('href');
        });

    const sink = {};
    sink.Router = intent.linkClicked$;

    return { intent, sink, component };
}
