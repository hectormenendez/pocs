import $ from 'xstream';

import Slider from '../../../components/examples/slider';

export default function Stage(source){

    const component = {};
    component.slider = props => Slider(Object.assign({ props: $.of(props) }, source));

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
