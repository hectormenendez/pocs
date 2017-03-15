import {Component} from '../../helpers/smv';

// Wrapper for easy usage of the Navigation plugin.
export default function Navigation(source){
    const component = Component({ source, path: 'components/navigation' });

    return (...args) => {
        const component$ = component(...args);
        return {
            // The state will always be inside a navigation property
            State: component$
                .map(component => component.State)
                .flatten()
                .map(state => ({ navigation: state })),
            // Expose the VirtualTree as a function so it can be used as a Tag
            DOM: component$
                .map(component => component.DOM)
                .flatten()
                .map(dom => ({ Navigation: () => dom })),
            // Expose the Router stream as is.
            Router: component$
                .map(component => component.Router)
                .flatten()
        }
    }
}
