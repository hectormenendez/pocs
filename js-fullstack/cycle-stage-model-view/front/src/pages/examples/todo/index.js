import Isolate from '@cycle/isolate';

import Stage from './stage';
import Model from './model';
import View  from './view.jsx';

export function main(sources){

    const stage = Stage(sources);
    const sink  = stage.sink || {};
    if (stage.sink) delete stage.sink;

    const { state$, vnode$ } = Model(stage);

    const vtree$ = vnode$
        .map(vnode => state$.map(state => View(state, vnode)))
        .flatten();

    return Object.assign({ state$, DOM: vtree$ }, sink);
}

export default sources => Isolate(main)(sources);
