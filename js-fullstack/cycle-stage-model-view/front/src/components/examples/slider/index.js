import $ from 'xstream';
import Isolate from '@cycle/isolate';

import Validate from '../../../helpers/validate';

import {html as Html} from 'snabbdom-jsx';

export function main(sources) {

    const props$ = sources.props;
    if (!props$ || props$.constructor !== $) throw new TypeError(
        `Expecting a props Stream, got ${props$? props$.constructor : props$}`
    );

    // intent
    const intent$ = sources.DOM
        .select('section')
        .events('input')
        .map(e => parseInt(e.target.value,10))

    // Model
    const state$ = props$
        // Props validation,
        .map(props => Validate(props, {
            value: [Number],
            unit : [String],
            type : [String],
            min  : Number,
            max  : Number,
        }))
        .map(props => intent$
            .fold((state, IntentValue) => {
                state.value = IntentValue;
                return state;
            }, props)
        )
        .flatten()

    // view
    const view = state => <section>
        <label>{state.type} {state.value} {state.unit} </label>
        <input type="range" min={state.min} max={state.max} value={state.value} />
    </section>

    return {
        state$,
        DOM: state$.map(state => view(state)),
    }
}

export default sources => Isolate(main)(sources);
