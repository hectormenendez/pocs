import {html as Html} from 'snabbdom-jsx';
import {Style} from './view.css';

export default ({loaded, logs, fields}) =>
<section className={Style}>
    {!loaded? <center>
        <h2>Cargando registros …</h2>
    </center> : ''}
    {loaded && !logs.length? <center>
        <h2>¡No existen registros!</h2>
        <button>RESTABLECER</button>
    </center> : ''}
    <header>
        <article>
            {fields.map(field =>
                <div>
                    <input
                        name={field}
                        title={field}
                        type="text"
                        placeholder={field}
                    />
                </div>
            )}
        </article>
    </header>
    <footer>
        {logs.map(log =>
            <article>
                {fields.map(field =>
                    <div>
                        <span>{log[field]}</span>
                    </div>
                )}
            </article>
        )}
    </footer>
</section>
