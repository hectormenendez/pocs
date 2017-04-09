import {html as Html} from 'snabbdom-jsx';
import {Style} from './view.css';

export default ({loaded, logs, fields, detail, filter}) =>
<section className={Style}>
    {!loaded? <center>
        <h2>Cargando registros …</h2>
    </center> : ''}
    {loaded && !logs.length? <center>
        <h2>¡No existen registros!</h2>
        <button>RESTABLECER</button>
    </center> : ''}

    <log-table>
        <log-head>
            <log-row>
                {fields.map(({ name, value, active })=>
                    <log-cell>
                        <fieldset attrs-data-active={active}>
                            <input
                                type="text"
                                name={name}
                                title={name}
                                placeholder={name}
                                value={value}
                            />
                            <button>✔</button>
                        </fieldset>
                    </log-cell>
                )}
            </log-row>
        </log-head>
        <log-body>
            {logs.map(log =>
                <log-row attrs-data-id={log._id}>
                    {fields.map(({ name }) =>
                        <log-cell>
                            <span>{log[name] || ''}</span>
                        </log-cell>
                    )}
                </log-row>
            )}
        </log-body>
    </log-table>

    {detail? <log-detail>
        <button>✘</button>
        {detail.map(({ name, value }) => <fieldset>
            <legend>{name}</legend>
            <pre>{value}</pre>
        </fieldset>)}
    </log-detail> : ''}
</section>
