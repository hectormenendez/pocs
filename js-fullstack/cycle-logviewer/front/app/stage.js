import $ from 'xstream';
import $fromEvent from 'xstream/extra/fromEvent';
import $throttle from 'xstream/extra/throttle';
import Debug from 'debug';

export default function Stage(sources){

    const debug = Debug('app:stage');
    const intent = {};


    /*************************************************************************************
     * Log list.
     ************************************************************************************/

    // Whenever new logs were requested and found on the server.
    intent.logsLoaded$ = sources.Feathers
        .select({ type:'local', service:'logs', method:'find' })
        .map(response => response.data);

    // Whenever new logs are created on the server.
    intent.logsCreated$ = sources.Feathers
        .select({ type:'socket', service:'logs', method:'created' });

    // Whenever the user need logs to be requested from the server.
    intent.logsNeeded$ = sources.DOM
        .select('center button')
        .events('click')
        .mapTo({});


    /*************************************************************************************
     * Log detail.
     ************************************************************************************/

    // Whenever a log detail was requested and found on the server.
    intent.detailLoaded$ = sources.Feathers
        .select({ type:'local', service:'logs', method:'get' })
        .map(data => Object
            .keys(data)
            .reduce(( result, name ) => (result.concat([{ name, value:data[name] }])), [])
        );

    // Whenever the user neds a detail requested from the server.
    intent.detailNeeded$ = sources.DOM
        .select('log-body log-row')
        .events('click')
        .map(e => e.ownerTarget.dataset.id);

    // Whenever the user needs to hide the detail.
    intent.detailHidden$ = sources.DOM
        .select('log-detail button')
        .events('click')
        .mapTo({});


    /*************************************************************************************
     * Filter
     ************************************************************************************/

    const filterDOM = sources.DOM.select('log-head input');
    const filterLostFocus$ = filterDOM
        .events('blur')
        // if the blur happened inside the same parent, omit it.
        .filter(e => {
            // e.relatedTarget: Webkit
            // e.explicitOriginalTarget: SpiderMonkey
            const clicked = e.relatedTarget || e.explicitOriginalTarget || {};
            if(!clicked.parentElement) return true;
            return e.target.parentElement.innerHTML != clicked.parentElement.innerHTML;
        });

    // Whenever the user interacts with a filter input.
    intent.filterChangedFocus$ = $
        .merge(filterDOM.events('focus'), filterLostFocus$)
        .map(e => ({
            name: e.target.getAttribute('name'),
            active: e.type === 'focus' || undefined,
        }));

    // Whenever the user applies a filter, get all the values from all the filters.
    intent.filterNeeded$ = sources.DOM
        .select('log-head button')
        .events('click')
        .map(e => {
            let parent = e.target;
            while((parent = parent.parentElement) && parent.tagName != 'LOG-HEAD');
            const inputs = [];
            parent.querySelectorAll('input').forEach(input => {
                inputs.push({
                    name: input.getAttribute('name'),
                    value: input.value
                });
            })
            return inputs;
        });


    /************************************************************************************/
    return {
        // Adds debug to every intent sent
        intent: Object
            .keys(intent)
            .map(k => ({ k, v:intent[k].debug(x => debug(`intent.${k}`, x)) }))
            .reduce((acc, {k,v}) => ({ ...acc, [k]:v }), {}),
    }
}
