import $ from 'xstream';
import Stage from './stage';
import Model from './model';
import View from './view.jsx';

export default (sources) => {
    const chars = Stage(sources);
    const sinks = Model(chars);
    sinks.DOM = sinks.State.map(state => View(state));
    return sinks;
}
