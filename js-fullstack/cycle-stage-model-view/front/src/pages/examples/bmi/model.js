import $ from 'xstream';

function CalculateBMI ({ height, weight }){
    height = height * 0.01;
    return Math.round(weight / Math.pow(height, 2));
}

export default function Model({ intent, component }){

    const initial  = {};
    initial.weight = 80;
    initial.height = 165;

    const sliderWeight$ = component.slider({
        unit  : 'kg',
        type  : 'Weight',
        min   : 40,
        max   : 120,
        value : initial.weight
    });

    const sliderHeight$ = component.slider({
        unit  : 'cm',
        type  : 'Height',
        min   : 140,
        max   : 220,
        value : initial.height
    })

    const stateWeight$ = sliderWeight$
        .map(component => component.state$)
        .flatten()
        .map(state => ({ weight: state.value }));

    const stateHeight$ = sliderHeight$
        .map(component => component.state$)
        .flatten()
        .map(state => ({ height: state.value }));

    const State = $
        .merge(stateHeight$, stateWeight$)
        .fold((state, cur) => Object.assign(state, cur), initial)
        // Calculate BMI
        .map(state => ({
            ...state,
            bmi: CalculateBMI({ height: state.height, weight: state.weight })
        }));

    const vnodeWeight$ = sliderWeight$
        .map(component => component.DOM)
        .flatten()
        .map(vnode => ({ SliderWeight: () => vnode }));

    const vnodeHeight$ = sliderHeight$
        .map(component => component.DOM)
        .flatten()
        .map(vnode => ({ SliderHeight: () => vnode }));

    const DOM  = $
        .combine(vnodeHeight$, vnodeWeight$)
        .map(([sliderHeight, sliderWeight]) => {
            return Object.assign({}, sliderHeight, sliderWeight);
        });

    return { State, DOM  };
}
