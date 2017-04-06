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

    <log-head>
        <log-row>
            {fields.map(field =>
                <log-cell>
                    <input
                        name={field}
                        title={field}
                        type="text"
                        placeholder={field}
                    />
                </log-cell>
            )}
        </log-row>
    </log-head>
    <log-body>
        {logs.map(log =>
            <log-row>
                {fields.map(field =>
                    <log-cell>
                        <span>{log[field] || ''}</span>
                    </log-cell>
                )}
            </log-row>
        )}
    </log-body>
</section>
