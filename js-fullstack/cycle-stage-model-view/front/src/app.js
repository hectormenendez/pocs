import Stream                         from 'xstream';
import {run as Run}                   from '@cycle/xstream-run';
import {makeDOMDriver as DomDriver}   from '@cycle/dom';
import {makeHTTPDriver as HttpDriver} from '@cycle/http';
import {html as Html}                 from 'snabbdom-jsx';

const Drivers = {
    HTTP : HttpDriver(),
    DOM  : DomDriver(document.getElementsByTagName('main')[0]),
};

function getUsers(){
}

// receives sources, emits sinks
function Main(sources){

    const stream = {};
    const source = {};

    // --------------------------------------------------------- Sources (both http & dom)

    source.checkbox = sources.DOM.select('input');
    source.button   = sources.DOM.select('button');
    source.users    = sources.HTTP.select('users');

    // -------------------------------------------------------------------- Http Streams

    // On each button click create an object that will be passed to the HttpDriver
    // that will generate the response stream
    stream.onButtonClick = source.button
        .events('click')
        .map(e => {
            const random = Math.round(Math.random() * 9) + 1;
            return {
                method  : 'GET',
                url     : `http://jsonplaceholder.typicode.com/users/${random}`,
                category: 'users'
            }
        })
        .debug(x => console.log(x))

    // Prepare data to be sent to the HTTP Driver

    const HTTP = Stream
        .combine(stream.onButtonClick)
        .map(streams => stream[0]);

    // -------------------------------------------------------------------- Dom Streams

    // On each checkbox toggle, stores a boolean telling wether the input is checked
    stream.onCheckboxToggle = source.checkbox
        .events('click')
        .map(e => e.target.checked)
        .startWith(null);

    // The streams that get generated after on each stream.onButtonClick
    stream.users = source.users
        .flatten()
        .map(response => response.body)
        .startWith(null);

    const DOM = Stream
        .combine(
            stream.onCheckboxToggle,
            stream.users
        )
        .map(([checked, user]) => <div>
            <button>ClickMe</button>
            <input type="checkbox" />
            <span>Toggle Me</span>
            <p>{ checked? 'ON' : 'OFF' }</p>
            { user }
        </div>);

    // Sinks
    return { DOM, HTTP }
}


Run(Main, Drivers);
