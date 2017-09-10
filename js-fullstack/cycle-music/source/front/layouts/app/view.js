import Snabbdom from 'snabbdom-pragma';

export default state => <section>
    <button className='decrement'>Decrement</button>
    <button className='increment'>Increment</button>
    <p>
        <strong>Counter: </strong>
        <span>{state.num}</span>
    </p>
</section>
