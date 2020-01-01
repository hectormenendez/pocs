import $, { Stream as TypeStream } from 'xstream';

import { TypeSinks, TypeSources } from '../utils/types';
import { TypeSink as TypeDOMSink } from '../utils/drivers/dom';
import { TypeSink as TypeStateSink, TypeValue as TypeStateValue } from '../utils/drivers/state';

export interface TypeState {
    count: number;
}

export interface TypeIntent {
    onIncrement$: TypeStream<null>;
    onDecrement$: TypeStream<null>;
    onNavigate$: TypeStream<null>;
}

export const State: TypeState = {
    count: 0
};

export default function Component(sources: TypeSources<TypeState>): TypeSinks<TypeState> {
    const intent: TypeIntent = Intent(sources);
    return {
        DOM: sources.state.stream.map(View),
        state: Model(intent),
        router: intent.onNavigate$.mapTo('/speaker'),
    };
}

function Intent(sources: TypeSources<TypeState>): TypeIntent {
    const { DOM } = sources;
    return {
        onIncrement$: DOM.select('.increment').events('click'),
        onDecrement$: DOM.select('.decrement').events('click'),
        onNavigate$: DOM.select('[data-action="navigate"]').events('click').mapTo(null)
    };
}

function Model(intent: TypeIntent): TypeStateSink<TypeState> {
    function setCount(n: number) {
        return (state: TypeState): TypeState => ({
            ...state,
            count: state.count + n
        });
    }
    const { onIncrement$, onDecrement$ } = intent;
    const state$: TypeStream<TypeStateValue<TypeState>> = $
        .of((state)=> state === undefined ? State : state);
    return $.merge(
        state$,
        onIncrement$.mapTo(setCount(+1)),
        onDecrement$.mapTo(setCount(-1))
    );
}

function View(state: TypeState): TypeDOMSink {
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
