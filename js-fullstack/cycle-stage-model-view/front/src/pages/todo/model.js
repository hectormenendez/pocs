import $ from 'xstream';

export default function Model({ intent }){

    const added$ = intent.add$
        .map(intent => todos => todos.concat({ text: intent.payload, done:false }));

    const toggled$ = intent.toggle$
        .map(intent => todos => todos.map((todo,i) => {
            if (i !== intent.payload) return todo;
            return { ...todo, done: !todo.done };
        }));

    const deleted$ = intent.delete$
        .map(intent => todos => todos.filter((todo,i) => i !== intent.payload));

    return $
        .merge(added$, toggled$, deleted$)
        .fold((todos, fn) => fn(todos), [])
        // .debug()
}
