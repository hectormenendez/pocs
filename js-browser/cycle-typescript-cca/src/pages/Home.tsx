import $ from 'xstream';
import { Sources, Sinks } from '../utils/types';
import Routes from '../routes';

export namespace Type {
    export interface State {}
}

export const NAME = 'PagesHome';

export const State = {};

export default function Component(sources: Sources<Type.State>): Sinks<Type.State> {
    const state$ = sources.state.stream;
    const vtree$ = state$.map(View);

    const reduce$ = Model({});

    return {
        DOM: vtree$,
        state: reduce$,
    };
}

function Model(intent) {
    const reduce$ = $.of(() => State);
    return reduce$;
}

function View(state) {
    return (
        <component id={NAME}>
            <header>
                <nav>
                    <ul>
                        {Routes.map((route) => (
                            <li>
                                <a href={`${route.path}`}>{route.id}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>
            <section>Section</section>
            <footer>Footer</footer>
        </component>
    );
}
