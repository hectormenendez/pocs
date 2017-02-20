import $ from 'xstream';

import {Component} from '../../../helpers/smv';

export default function Stage(source){

    const component = {};
    component.slider = Component({ source, path: 'components/examples/slider' });

    const intent  = {};
    intent.click$ = source.DOM
        .select('a')
        .events('click')
        .map(e => {
            e.preventDefault();
            return e.target.getAttribute('href');
        });

    const sink = {};
    sink.Router = intent.click$;

    return { intent, component, sink };
}
