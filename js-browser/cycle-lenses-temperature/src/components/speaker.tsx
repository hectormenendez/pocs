import $, { Stream as TypeStream } from 'xstream';
import SampleCombine from 'xstream/extra/sampleCombine';

import { TypeSinks, TypeSources } from '../utils/types';

export interface TypeState {
    text: string;
}

export interface TypeIntent {
    onInput$: TypeStream<string>;
    onSpeak$: TypeStream<null>;
    onNavigate$: TypeStream<null>;
}

export const State: TypeState = {
    text: 'Edit me!',
};

export default function Component(sources: TypeSources<TypeState>): TypeSinks<TypeState> {
    const intent: TypeIntent = Intent(sources);
    const state$ = Model(intent);
    const speech$ = intent.onSpeak$
        .compose(SampleCombine(sources.state.stream))
        .map(([_, { text }]) => text)
    return {
        DOM: sources.state.stream.map(View),
        state: state$,
        speech: speech$,
        router: intent.onNavigate$.mapTo('/counter'),
    };
}

function Intent(sources: TypeSources<TypeState>): TypeIntent {
    const { DOM } = sources;
    return {
        onInput$: DOM.select('#text').events('input').map((e) => e.target.value),
        onSpeak$: DOM.select('[data-action="speak"]').events('mouseover').mapTo(null),
        onNavigate$: DOM.select('[data-action="navigation"]').events('click').mapTo(null),
    }
}

function Model(intent: TypeIntent): TypeStateSink<TypeState> {
    const { onInput$ } = intent;
    return $.merge(
        $.of(() => State),
        onInput$.map(text => (state: TypeState) => ({ ...state, text })),
    );
}

function View(state: TypeState): TypeDOMSink {
    const { text } = state;
    return (
        <div>
            <h2>My Awesome Cycle.js app - Page 2</h2>
            <textarea id="text" rows="3" value={text} />
            <button type="button" data-action="speak">Speak to Me!</button>
            <button type="button" data-action="navigation">Page 1</button>
        </div>
    );
}
