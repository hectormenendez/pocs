import $ from 'xstream';
import {Action as RouteAction} from 'cycle-page';

import Routes from 'app/routes';

export default ({ intent, debug }) => ({
    // Define the state available externally (to the view mostly)
    State:$.of({
        // The state to render the first time
        initial$: $.of(state => ({
            // The default subject
            subject: 'World',
            // get a { name, value } from each route.
            routes: Object
                .keys(Routes)
                .map(legend => ({ legend, href:Routes[legend].uri }))
                .filter(route => route.legend != 'root') // omit the current route
        }))
    })
})
