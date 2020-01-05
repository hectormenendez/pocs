import $ from 'xstream';
import Isolate from '@cycle/isolate';

import { Source as SourceDOM, Sink as SinkDOM } from '../utils/types/driver-dom';
import { Source as SourceState, Sink as SinkState } from '../utils/types/driver-state';

import Thermometer, { Type as TypeThermometer } from '../components/Thermometer';

export namespace Type {
    export interface PropCelcius extends TypeThermometer.Props {}
    export interface PropFahrenheit extends TypeThermometer.Props {}

    export interface Props {
        Celcius: PropCelcius;
        Fahrenheit: PropFahrenheit;
    }

    export interface State {
        Celcius?: PropCelcius;
        Fahrenheit?: PropFahrenheit;
    }

    export interface Sources {
        DOM: SourceDOM;
        state: SourceState<State>;
    }

    export interface Sinks {
        DOM: SinkDOM;
        state: SinkState<State>;
    }
}

export default function Component(sources: Type.Sources): Type.Sinks {
    const props: Type.Props = {
        Celcius: { value: 0, step: 2, label: 'Celcius' },
        Fahrenheit: { value: 0, step: 5, label: 'Fahrenheit' },
    };

    const Celcius = Isolate(Thermometer, {
        // every other sink will be scoped to this identifier
        '*': 'Celcius',
        // use lenses(getter/setter) to manage shared state.
        state: {
            // determine the value for the local state.
            get(state: Type.State) {
                console.log('C:get', state);
                return state.Celcius;
            },
            // compute the global state, after the local state was set.
            set(state: Type.State, Celcius: Type.PropCelcius) {
                const newState = {
                    ...state,
                    Celcius,
                    Fahrenheit: {
                        ...(state.Fahrenheit || props.Fahrenheit),
                        value: Math.round((Celcius.value * 9) / 5 + 32),
                    },
                };
                console.log('C:set', newState);
                return newState;
            },
        },
    })({ ...sources, props$: $.of(props.Celcius) });

    const Fahrenheit = Isolate(Thermometer, {
        // every other sink will be scoped to this identifier
        '*': 'Fahrenheit',
        // use lenses(getter/setter) to manage shared state.
        state: {
            // determine the value for the local state.
            get(state: Type.State) {
                console.log('F:get', state);
                return state.Fahrenheit;
            },
            // compute the global state, after the local state was set.
            set(state: Type.State, Fahrenheit: Type.PropFahrenheit) {
                const newState = {
                    ...state,
                    Fahrenheit,
                    Celcius: {
                        ...(state.Celcius || props.Celcius),
                        value: Math.round(((Fahrenheit.value - 32) * 5) / 9),
                    },
                };
                console.log('F:set', newState);
                return newState;
            },
        },
    })({ ...sources, props$: $.of(props.Fahrenheit) });

    const reduce$ = $.of((prevState: Type.State) => prevState || {});

    return {
        DOM: $.combine(sources.state.stream, Celcius.DOM, Fahrenheit.DOM).map(
            ([state, celcius, fahrenheit]) => (
                <component>
                    <header>
                        <h2>Shared State management</h2>
                    </header>
                    <section>
                        {fahrenheit}
                        {celcius}
                    </section>
                </component>
            ),
        ),
        state: $.merge(reduce$, Celcius.state, Fahrenheit.state),
    };
}
