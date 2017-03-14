import $ from 'xstream';
import Validate from '../../helpers/validate';

export default function Model({ props$, intent }){

    // State sinks is based upon props stream
    const State = props$
        // A title and items are required
        .debug(props => Validate(props,{ title: [String], items: [Array] }))
        // Each item must hace its own title and href defined.
        .debug(({items}) => items
            .forEach(item => Validate(item, { href:[String], title:[String] })))

    return { State };
}
