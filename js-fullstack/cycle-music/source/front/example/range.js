import $ from 'xstream';
import Snabbdom from 'snabbdom-pragma';

const Intent = ({ DOM }) => $.merge(
    DOM // Everytime the slider is moved
        .select('input')
        .events('input')
        .map(e => ({ type: 'VALUE', payload: e.target.value })),
    DOM // Every time the delete button is pressed
        .select('button')
        .events('click')
        .map(() => ({ type: 'DEL' })),
);

const Model = actions$ => $.merge(
    // Initial reducer
    $.of(state => state || { value: 0, max: 10 }),
    // The value needs to be modified
    actions$
        .filter(({ type }) => type === 'VALUE')
        .map(({ payload }) => state => ({ ...state, value: payload })),
    // The component needs to be deleted
    actions$
        .filter(({ type }) => type === 'DEL')
        .map(() => () => undefined), // By returning undefined, onionify removes it.
);

const View = ({ value, max }) =>
    <section>
        <input type="range" value={value} max={max} />
        <aside>
            <span>The value is {value}</span>
            <button>del</button>
        </aside>
    </section>;

export default function ComponentRange(sources) {

    const actions$ = Intent(sources);
    const onion$ = Model(actions$);
    const dom$ = sources.onion.state$.map(View);

    return {
        DOM: dom$,
        onion: onion$,
    };
}
