import $ from 'xstream';
import { html as Html } from 'snabbdom-jsx';

const Stage = ({ DOM }) => ({
    state: {
        count: 0,
    },
    intent: {
        onDecrement$: DOM.select('button[name=decrement]').events('click').mapTo(-1),
        onIncrement$: DOM.select('button[name=increment]').events('click').mapTo(+1),
    }
})

function Model(staged){
    const { onDecrement$, onIncrement$ } = staged.intent;
    return $
        .merge(onDecrement$, onIncrement$)
        .fold((state, value) => {
            const { count } = state;
            return { ...state, count: count + value }
        }, staged.state)
}

function View(state) {
    const { count } = state;
    return (
        <section>
            <h2>Times: <span>{count}</span> </h2>
            <footer>
                <button name="increment">Increment</button>
                <button name="decrement">Decrement</button>
            </footer>
        </section>
    )
};


export default { Stage, Model, View };