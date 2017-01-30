import $ from 'xstream';
import {html as Html} from 'snabbdom-jsx';

import Model  from './model';
import View   from './view';
import Intent from './intent';

import Slider from '../components/slider';

export default function(sources){

    const altura  = {};
    altura.props = {
        label: 'Altura',
        units: 'cm',
        value: {
            min: 140,
            max: 220,
            ini: 177
        }
    };
    altura.component = Slider({ DOM:sources.DOM, props$: $.of(altura.props) });
    altura.state$    = altura.component.state$.startWith(altura.props);

    const peso = {};
    peso.props = {
        label: 'Peso',
        units: 'kg',
        value: {
            min: 50,
            max: 130,
            ini: 93
        }
    };
    peso.component = Slider({ DOM: sources.DOM, props$: $.of(peso.props) });
    peso.state$    = peso.component.state$.startWith(peso.props);

    const component$ = $
        .combine(altura.component.DOM, peso.component.DOM)
        .map(([altura, peso]) => ({altura, peso}));

    const state$ = $
        .combine(altura.state$, peso.state$)
        .map(([altura, peso]) => ({altura, peso}))
        .map(state => {
            const altura = state.altura.value.ini * 0.01;
            state.bmi  = Math.round(state.peso.value.ini / Math.pow(altura, 2));
            return state;
        });

    const vtree$ = $
        .combine(component$, state$)
        .map(([component, state]) => <section>
            {component.peso}
            {component.altura}
            <h2>Tu BMI es {state.bmi}</h2>
        </section>);

    return {
        DOM: vtree$
    }

//     const intent = Intent(sources);
//     const state$ = Model(intent);
//     const vtree$ = state$.map(View);
//     return {
//         DOM: vtree$
//     }
}
