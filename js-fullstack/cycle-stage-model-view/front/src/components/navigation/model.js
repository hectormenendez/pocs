import $ from 'xstream';
import Validate from '../../helpers/validate';

export default function Model({ props$ }){

    // The initial state
    const initial = {
        title : '',
        opts  : []
    };

    // Convert the props into state
    const state$ = props$
        .debug(props => Validate(props,{
            title: [String],
            opts : [Array]
        }))
        .debug(({opts}) => opts
            .forEach(opt => Validate(opt, { href:[String], title:[String] }))
        )

    const vnode$ = $.of(null);

    return { state$, vnode$ }
}
