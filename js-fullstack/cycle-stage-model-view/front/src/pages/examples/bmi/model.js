import $ from 'xstream';

import CreateComponentStream from '../../../helpers/component';

function CalculateBMI ({ height, weight }){
    height = height * 0.01;
    return Math.round(weight / Math.pow(height, 2));
}

export default function Model({ intent, component }){

    const initial  = {};
    initial.weight = 80;
    initial.height = 165;
    initial.bmi    = CalculateBMI({
        height: initial.height,
        weight: initial.weight
    });

    const sliderWeight = {};
    sliderWeight.component = component.slider({
        unit  : 'kg',
        type  : 'Weight',
        min   : 40,
        max   : 120,
        value : initial.weight
    });

    sliderWeight.state$ = sliderWeight.component.state$
        .map(state => ({ weight: state.value }))
        .startWith({ weight: initial.weight });

    sliderWeight.vnode$ = sliderWeight.component.DOM
        .map(vnode => ({ SliderWeight: () => vnode }));

    const sliderHeight = {};
    sliderHeight.component = component.slider({
        unit  : 'cm',
        type  : 'Height',
        min   : 140,
        max   : 220,
        value : initial.height
    })

    sliderHeight.state$ = sliderHeight.component.state$
        .map(state => ({ height: state.value }))
        .startWith({ height: initial.height });

    sliderHeight.vnode$ = sliderHeight.component.DOM
        .map(vnode => ({ SliderHeight: () => vnode }));

    const vnode$ = $
        .combine(sliderHeight.vnode$, sliderWeight.vnode$)
        .map(([sliderHeight, sliderWeight]) => {
            return Object.assign({}, sliderHeight, sliderWeight);
        })

    const state$ = $
        .merge(sliderWeight.state$, sliderHeight.state$)
        .fold((state, curr) => Object.assign(state, curr), { bmi: initial.bmi })
        .map(state => {
            state.bmi = CalculateBMI({
                height: state.height,
                weight: state.weight
            });
            return state;
        });

    return { vnode$, state$ }
}
