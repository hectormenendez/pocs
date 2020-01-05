import $ from 'xstream';
import SampleCombine from 'xstream/extra/sampleCombine';

import { Stream, Sinks, Sources } from '../utils/types';
import { Sink as SinkState } from '../utils/types/driver-state';
import { Value as ValueDOM } from '../utils/types/driver-dom';

export namespace Type {
    export interface State {
        text: string;
    }

    export interface Intent {
        onInput$: Stream<string>;
        onSpeak$: Stream<null>;
        onNavigate$: Stream<null>;
    }
}

export const State: Type.State = {
    text: 'Edit me!',
};

export default function Component(sources: Sources<Type.State>): Sinks<Type.State> {
    const intent: Type.Intent = Intent(sources);
    const state$ = Model(intent);
    const speech$ = intent.onSpeak$
        .compose(SampleCombine(sources.state.stream))
        .map(([_, { text }]) => text);
    return {
        DOM: sources.state.stream.map(View),
        state: state$,
        speech: speech$,
        router: intent.onNavigate$.mapTo('/counter'),
    };
}

function Intent(sources: Sources<Type.State>): Type.Intent {
    const { DOM } = sources;
    return {
        onInput$: DOM.select('textarea')
            .events('input')
            .map((e) => {
                const target = e.target as HTMLTextAreaElement;
                return target.value;
            }),
        onSpeak$: DOM.select('[data-action="speak"]')
            .events('click')
            .mapTo(null),
        onNavigate$: DOM.select('[data-action="navigation"]')
            .events('click')
            .mapTo(null),
    };
}

function Model(intent: Type.Intent): SinkState<Type.State> {
    const state$ = $.of(() => State);
    const input$ = intent.onInput$.map((text) => (state: Type.State) => ({
        ...state,
        text,
    }));
    return $.merge(state$, input$);
}

function View(state: Type.State): ValueDOM {
    const { text } = state;
    return (
        <div>
            <h2>My Awesome Cycle.js app - Page 2</h2>
            <textarea id="text" rows="3" value={text} />
            <button type="button" data-action="speak">
                Speak to Me!
            </button>
            <button type="button" data-action="navigation">
                Page 1
            </button>
        </div>
    );
}
