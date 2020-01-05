import { css as Style } from 'emotion';

import { Stream, Component, Sources as _Sources, Sinks as _Sinks } from '../utils/types';
import { Resolve } from '../utils/types/driver-router';
import Routes from '../routes';

const ClassName = Style`
    display: flex;
    height: inherit;
    flex-direction: column;
    justify-content: space-between;
    & > header {
        background-color: deepskyblue;
        nav {
            ul, li {
                margin: 0;
                padding: 0;
            }
            ul {
                list-style: none;
                display: flex;
                justify-content: space-around;
                align-items: center;
                a {
                    display: block;
                    color: white;
                    line-height: 3em;
                    padding: 0 1.5em;
                    text-decoration: none;
                    &:hover {
                        background-color: black;
                    }
                }
            }
        }
    }
    header + * {
        background-color: white;
        flex-grow: 1;
        padding: 1em;
    }
    footer {
        background-color: #eee;
        padding: 1.5em 0;
        text-align: center;
        font-size: small;
        opacity: 0.33;
        cursor: default;
    }
`;

export namespace Type {
    export interface State {}

    export interface Props {
        content$: Stream<JSX.Element>;
        route: Resolve.Route;
    }

    export interface Sources extends _Sources<State> {
        props$: Stream<Props>;
    }

    export interface Sinks extends _Sinks<State> {}
}

export const NAME = 'Main';

export default function Component(sources: Type.Sources): Type.Sinks {
    const props$ = sources.props$
        .map(({ content$, route }) => content$.map(content => ({ content, route })))
        .flatten()
        .map(({ content, route }) => ({
            content,
            routes: Routes.filter(({ id }) => id !== route.id), // exclude sent route.
        }))
    return {
        DOM: props$.map(({ content, routes }) => (
            <component className={ClassName} data-name={NAME}>
                <header>
                    <nav>
                        <ul>
                            {routes.map(({ path, id }) => (
                                <li>
                                    <a href={path}>{id}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </header>
                {content}
                <footer>All rights reserved, GIK© {new Date().getFullYear()}</footer>
            </component>
        )),
    };
}
