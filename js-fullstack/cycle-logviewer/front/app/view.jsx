import {html as Html} from 'snabbdom-jsx';

export default ({logs}) => <code>
    {logs.map(({ type, _date, message }) => <article>
        <b>{_date}</b> [<u>{type}</u>]  <i>{message}</i>
    </article>)}
</code>
