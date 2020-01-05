import $ from  'xstream';

import { Stream, Sinks, Sources } from '../utils/types';
import { Value as ValueDOM } from '../utils/types/driver-dom';
import { Sink as StateSink, Value as StateValue } from '../utils/types/driver-state';

export namespace Type {
    export interface State {
        count: number;
    }
    export interface Intent {
        onIncrement$: Stream<null>;
        onDecrement$: Stream<null>;
        onNavigate$: Stream<null>;
    }
}

export const State: Type.State = {
    count: 0
};

export default function Component(sources: Sources<Type.State>): Sinks<Type.State> {
    const intent: Type.Intent = Intent(sources);
    return {
        DOM: sources.state.stream.map(View),
        state: Model(intent),
        router: intent.onNavigate$.mapTo('/speaker'),
    };
}

function Intent(sources: Sources<Type.State>): Type.Intent {
    const { DOM } = sources;
    return {
        onIncrement$: DOM.select('.increment').events('click').mapTo(null),
        onDecrement$: DOM.select('.decrement').events('click').mapTo(null),
        onNavigate$: DOM.select('[data-action="navigate"]').events('click').mapTo(null)
    };
}

function Model(intent: Type.Intent): StateSink<Type.State> {
    function setCount(n: number) {
        return (state: Type.State): Type.State => ({
            ...state,
            count: state.count + n
        });
    }
    const { onIncrement$, onDecrement$ } = intent;
    const state$: Stream<StateValue<Type.State>> = $
        .of((state)=> state === undefined ? State : state);
    return $.merge(
        state$,
        onIncrement$.mapTo(setCount(+1)),
        onDecrement$.mapTo(setCount(-1))
    );
}

function View(state: Type.State): ValueDOM {
    const { count } = state;
    return (
        <div>
            <h2>My Awesome Cycle.js app - Page 1</h2>
            <span>{'Counter: ' + count}</span>
            <button type="button" className="increment">
                Increase
            </button>
            <button type="button" className="decrement">
                Decrease
            </button>
            <button type="button" data-action="navigate">
                Page 2
            </button>
        </div>
    );
}
