import {html as Html} from 'snabbdom-jsx';

export default ({logs}) => <code>
    {logs.map(log => <article>
        <b>{log.type}</b>   <i>{log.message}</i>
    </article>)}
</code>
