import {html as Html} from 'snabbdom-jsx';
import {Style} from './view.css';

export default ({logs, fields}) =>
<section className={Style}>
    <header>
        {fields.map(field =>
            <input name={field} type="text" placeholder={field}/>
        )}
    </header>
    <footer>
        {logs.map(log =>
            <article>
                {fields.map(field =>
                    <div>{log[field]}</div>
                )}
            </article>
        )}
    </footer>
</section>
