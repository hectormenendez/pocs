import $ from 'xstream';

export default function Model(){
    const vnode$ = $.of({});
    const state$ = $.of(null);

    return { vnode$ , state$ }
}
