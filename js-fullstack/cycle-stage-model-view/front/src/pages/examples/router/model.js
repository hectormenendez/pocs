import $ from 'xstream';

export default function Model({intent, component}){

    const xtatic = {};
    xtatic.component = component.static({ text: 'Cycle' });
    xtatic.vnode$ = xtatic.component.DOM
        .map(vnode => ({ Static: () => vnode }));

    const DOM = $
        .combine(xtatic.vnode$)
        .map(([Static]) => {
            return Object.assign({}, Static);
        });

    const State = $.of(null);

    return { State, DOM };
}
