import $ from 'xstream';
import Isolate from '@cycle/isolate';

import Layout from '../layouts/Main';
import Routes from '../routes';
import { Sources, Sinks } from '../utils/types';

export const NAME = 'Home';

export default function Component(sources: Sources<null>): Sinks<null> {
    const Main = Isolate(Layout)({
        ...sources,
        props$: $.of({
            content$: $.of(
                <component>
                    <p>Please, select one of the above.</p>
                    <hr />
                    <h4>Stuff still pending to finish:</h4>
                    <ul>
                        <li>
                            Make all the pages use this layout (had trouble making it
                            work with counter, state was not being passed properly)
                        </li>
                        <li>
                            Set the title of every page, using the routes file.
                        </li>
                    </ul>
                </component>,
            ),
            route: Routes.find(({ id }) => id === NAME),
        }),
    });
    return {
        DOM: Main.DOM,
    };
}
