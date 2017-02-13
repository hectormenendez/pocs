import $ from 'xstream';

export default function Model({intent, component}){

    const xtatic = {};
    xtatic.component = component.static({ text: 'Cycle' });
    xtatic.vnode$ = xtatic.component.DOM
        .map(vnode => ({ Static: () => vnode }));

    const vnode$ = $
        .combine(xtatic.vnode$)
        .map(([Static]) => {
            return Object.assign({}, Static);
        });

    const state$ = $.of(null);

    return { state$, vnode$ };
}
