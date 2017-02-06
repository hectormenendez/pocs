import $ from 'xstream';

import Intent from './intent';
import Model  from './model';
import View   from './view.jsx';

// import Slider from '../components/slider';

export default function(sources){

    const intent = Intent({
        socket: sources.Feathers,
        dom   : sources.DOM
    });

    const state$ = Model(intent);

    return {
        DOM : state$.map(state => View(state))
    }
}
