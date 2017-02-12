import $ from 'xstream';
import StaticComponent from '../../../components/examples/static';

export default function Model(intent, source){
    const vnode = {};
    vnode.static$ = StaticComponent(source).DOM;

    const vnode$ = $
        .combine(vnode.static$)
        .map(vnodes => vnodes.map(vnode => () => vnode))
        .map(([Static]) => ({ Static }));

    const state = {};
    state.linkClicked$ = intent.linkClicked$.startWith(null);

    const state$ = $
        .combine(state.linkClicked$)
        .map(([linkClicked]) => ({linkClicked}))

    return $
        .combine(state$, vnode$)
        .map(([state,vnode]) => ({state, vnode}))
        .debug()
}
