import $ from 'xstream';
import $Flatten from 'xstream/extra/flattenConcurrently';
import Debug from 'debug';
import SMV from './index';

export default function Router(routes={}){
    const debug = Debug('smv:router');
    debug('source', routes);
    // Convert routes to an array, so it can be traversed as stream;
    routes = Object
        .keys(routes)
        .map(name => ({ name, ...routes[name] }));
    return $
        .from(routes)
        // Load the main function
        .map(route => SMV(route.path).map(main => ({ ...route, main })))
        .compose($Flatten)
        // fold into an object containing all the routes and their corresponding SMV
        .fold((acc, cur) => ({ ...acc, [cur.name]: cur }))
        .last()
        .debug(routes => debug('sink', routes));
}
