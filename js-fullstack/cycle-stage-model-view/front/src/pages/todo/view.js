import {html as Html} from 'snabbdom-jsx';

export default state => <section>
    <h1> To DO: </h1>
    <div>
        <input className="add" type="text"/>
    </div>
    <ul>
        { state.map((todo,i) =>
        <li
            selector         = ".todo"
            class-done       = {todo.done}
            attrs-data-index = {i}>
            <span> {todo.text} </span>
            <button> x </button>
        </li>) }
    </ul>
</section>
