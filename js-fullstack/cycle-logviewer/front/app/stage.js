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
        .map(response => response.data)
    // Everytime a log is created update it.
    feather.created$ = sources.Feathers
        .select({ type:'socket', service:'logs', method:'created' })


    const event = {};
    // A click on the "RESTABLECER" button
    event.reset$ = sources.DOM
        .select('button')
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
    event.scroll$ = $fromEvent(window, 'scroll')
        .compose($throttle(100))
        .addListener({ next: x => { console.log('.-----') }})


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


    return { intent }
}
