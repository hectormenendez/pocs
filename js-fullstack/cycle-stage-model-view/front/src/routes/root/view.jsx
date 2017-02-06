import {html as Html} from 'snabbdom-jsx';

export default state => <section>
    <div>
        <label>Count</label>
        <input type="text" readonly value={!state? 0 : state.count} />
    </div>

    <hr/>
    <div className="creator">
        <label>Create</label>
        <input
            type        = "text"
            placeholder = "Name"
            value       = {state && state.userCreated? '' : null}/>
        <button>OK</button>
    </div>
</section>
