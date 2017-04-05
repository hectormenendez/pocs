import $ from 'xstream';
import Debug from 'debug';

export default function Stage(sources){

    const debug = Debug('app:stage');

    const reset$ = sources.DOM
        .select('button')
        .events('click')
        .mapTo({});

    const filter$ = sources.DOM
        .select('input')
        .events('keyup')
        .map(e => ({
            val: e.target.value,
            key: e.target.getAttribute('name')
        }));

    const intent = {};
    // Whenever a field is being filtered
    intent.filter$ = filter$
        .filter(({val}) => val.length)
        .debug(data => debug('intent.filter', data));
    // Whenever all filters are back to empty
    intent.reset$ = $
        .merge( filter$, reset$)
        .filter(({val}) => !val || !val.length)
        .debug(data => debug('intent.reset', data));

    const feather = {};
    // Fetch initial logs when starting
    feather.init$ = sources.Feathers
        .select({ type:'local', service:'logs', method:'find' })
        .map(response => response.data)
        .debug(data => debug('feather.init', data));
    // Everytime a log is created update it.
    feather.created$ = sources.Feathers
        .select({ type:'socket', service:'logs', method:'created' })
        .debug(data => debug('feather.created', data));

    return { feather, intent }
}
