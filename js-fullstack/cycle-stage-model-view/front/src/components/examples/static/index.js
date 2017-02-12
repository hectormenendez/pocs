import $ from 'xstream';
import Isolate from '@cycle/isolate';
import {html as Html} from 'snabbdom-jsx';

export function main(sources){
    const text = !sources.props || !sources.props.text ? 'Mundo' : sources.props.text;
    return { DOM: $.of(<i>{text}!</i>) }
}

export default sources => Isolate(main)(sources);
