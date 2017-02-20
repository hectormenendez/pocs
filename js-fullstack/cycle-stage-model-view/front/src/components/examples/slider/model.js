import $ from 'xstream';
import Validate from '../../../helpers/validate';

export default function Model({ intent, props$ }){

    const state = {
        value: 0,  // Populated by props
        unit : '', // Populated by props
        type : '', // Populated by props
        min  : 0 ,
        max  : 100,
    };

    const state$ = props$
        // Props validation,
        .debug(props => Validate(props, {
            value: [Number],
            unit : [String],
            type : [String],
            min  : Number,
            max  : Number,
        }))
        .map(props => intent.slide$
            .fold((acc, value) => ({ ...acc, value }), Object.assign(state, props))
        )
        .flatten()

    return { state$, vnode$: $.of(null) };
}
