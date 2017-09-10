import $ from 'xstream';
import Snabbdom from 'snabbdom-pragma';

export default function App(sources){

    const dom = {
        decrement: sources.DOM.select('.decrement'),
        increment: sources.DOM.select('.increment'),
    };

    const action = {
        decrement$: dom.decrement.events('click').map(e => -1),
        increment$: dom.increment.events('click').map(e => +1),
    };

    // const { state$ } = sourceOnionify(App)s.onion;
    const state = { num: 0 };
    const action$ = $
        .merge(action.decrement$, action.increment$)
        .fold((acc, num) => ({ ...acc, num: acc.num + num }), state)

    const vdom$ = action$.map(state => <section>
        <button className='decrement'>Decrement</button>
        <button className='increment'>Increment</button>
        <p>
            <strong>Counter: </strong>
            <span>{ state.num }</span>
        </p>
    </section>);

    const reducer = {
        init$: $.of({ count: 0 }),
        action$: action$.map(num => state => ({ ...state, count: state.count + num })),
    }

    const reducer$ = $.merge(reducer.init$, reducer.action$);

    return {
        DOM: vdom$,
    }

}
