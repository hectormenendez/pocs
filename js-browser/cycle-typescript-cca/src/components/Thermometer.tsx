import $ from 'xstream';
import { Stream } from '../utils/types';
import { Sources as SourcesAll, Sinks as SinksAll } from '../utils/types';

export namespace Type {
    export type PropLabel = string;
    export type PropStep = number;
    export type PropValue = number;

    export interface Props {
        label: PropLabel;
        step: PropStep;
        value: PropValue;
    }

    export interface State extends Props {}

    export interface Sources extends SourcesAll<State> {
        props$: Stream<Props>;
    }

    export interface Sinks extends SinksAll<State> {}
}

export default function Component(sources: Type.Sources): Type.Sinks {
    const { DOM, state, props$ } = sources;
    const intent = {
        onIncrease$: DOM.select('.increase').events('click'),
        onDecrease$: DOM.select('.decrease').events('click'),
    };
    const setValue = (value: Type.PropValue) => (prevState: Type.State) => ({
        ...prevState,
        value: prevState.value + value,
    });
    return {
        state: props$
            .map((props) =>
                $.merge(
                    $.of((prevState: Type.State) => prevState || props),
                    intent.onDecrease$.mapTo(setValue(props.step * -1)),
                    intent.onIncrease$.mapTo(setValue(props.step)),
                ),
            )
            .flatten(),
        DOM: state.stream.map(({ label, value }) => (
            <component>
                <h1>
                    {value} {label}
                </h1>
                <button className="increase">+</button>
                <button className="decrease">-</button>
            </component>
        )),
    };
}
