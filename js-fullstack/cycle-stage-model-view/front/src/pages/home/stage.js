import $ from 'xstream';
import Navigation from '../../components/navigation';

export default function Stage(source){

    const component = {};
    component.navigation = Navigation(source);

    const intent = {};
    intent.click$ = source.DOM
        .select('a')
        .events('click')
        .filter(e => e.target.getAttribute('href').slice(0,1) == '#')
        .map(e => {
            e.preventDefault();
            return e.target.getAttribute('href').slice(1);
        });

    const sink = {};
    sink.Router = intent.click$;

    return { sink, intent, component };
}
