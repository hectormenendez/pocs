// NPM Modules
import $ from 'xstream';
import Snabbdom from 'snabbdom-pragma';
import Isolate from '@cycle/isolate';
// Local modules
import ComponentRanges from './ranges';


const Intent = ({ DOM }) => $.merge(
    DOM // The Add button is pressed
        .select('.main > button')
        .events('click')
        .map(() => ({ type: 'ADD' })),
);

const Model = actions$ => $.merge(
    // Initial reducer
    $.of(state => state || ({ ranges: [null, null] })),
    // Newly added ranges
    actions$
        .filter(({ type }) => type === 'ADD')
        .map(() => state => ({
            ...state,
            ranges: state.ranges.concat({ value: 10, max: 10 }),
        })),
);

const View = (state, { Ranges }) =>
    <section className='main'>
        <h2>The number of ranges is {state.ranges.length}</h2>
        <button>Add another</button>
        <Ranges/>
    </section>;

export default function Main(sources) {

    const sinksRange = Isolate(ComponentRanges, 'ranges')(sources);

    const actions$ = Intent(sources);
    const reducer$ = Model(actions$);

    const onion$ = $.merge(reducer$, sinksRange.onion);
    const vnode$ = $
        .combine(sources.onion.state$, sinksRange.DOM)
        .map(([state, vnodesRange]) => View(state, {
            Ranges: () => vnodesRange.map(vnode => vnode),
        }));

    return {
        DOM: vnode$,
        onion: onion$,
    };
}
