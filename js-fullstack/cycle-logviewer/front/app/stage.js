import $ from 'xstream';
import $fromEvent from 'xstream/extra/fromEvent';
import $throttle from 'xstream/extra/throttle';
import Debug from 'debug';

export default function Stage(sources){

    const debug = Debug('app:stage');


    const feather = {};
    // Fetch initial logs when starting
    feather.loaded$ = sources.Feathers
        .select({ type:'local', service:'logs', method:'find' })
        .map(response => response.data);
    // Everytime a log is created update it.
    feather.created$ = sources.Feathers
        .select({ type:'socket', service:'logs', method:'created' });
    // Whenever a detail arrives, convert the object to an array containing key:value
    feather.detail$ = sources.Feathers
        .select({ type:'local', service:'logs', method:'get' })
        .map(data => Object
            .keys(data)
            .reduce(( result, name ) => (result.concat([{ name, value:data[name] }])), [])
        )


    const event = {};
    // A click on the "RESTABLECER" button
    event.reset$ = sources.DOM
        .select('center button')
        .events('click')
        .mapTo({});
    // Whenever a key is pressed on the filter inputs.
    event.filter$ = sources.DOM
        .select('input')
        .events('keyup')
        .map(e => ({
            val: e.target.value,
            key: e.target.getAttribute('name')
        }));
    event.detail$ = sources.DOM
        .select('log-body log-row')
        .events('click')
        .map(e => e.ownerTarget.dataset.id);
    event.detailHide$ = sources.DOM
        .select('log-detail button')
        .events('click')
        .mapTo({});


    const intent = {};
    // Whenever a field is being filtered
    intent.filter$ = event.filter$
        .filter(({val}) => val.length)
        .debug(data => debug('intent.filter', data));
    // Whenever the logs need to be reset
    intent.reset$ = $
        .merge( event.filter$, event.reset$)
        .filter(({val}) => !val || !val.length)
        .debug(data => debug('intent.reset', data));
    // Whenever the lofs need to be reloaded
    intent.load$ = feather.loaded$
        .debug(data => debug('intent.load', data));
    // Whenever a log needs to be appended
    intent.append$ = feather.created$
        .debug(data => debug('intent.append', data));
    // Whenever a row is clicked for log details.
    intent.detailRequest$ = event.detail$
        .debug(data => debug('intent.detailRequest', data));
    intent.detailShow$ = feather.detail$
        .debug(data => debug('intent.detailShow', data));
    intent.detailHide$ = event.detailHide$
        .debug(data => debug('intent.detailHide', data));


    return { intent }
}
