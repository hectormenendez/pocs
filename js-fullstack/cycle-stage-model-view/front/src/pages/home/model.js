import $ from 'xstream';

export default function Model({ intent }){

    const vnode$ = $.of(null);
    const state$ = $.of(null);

    return { state$, vnode$ }
}
