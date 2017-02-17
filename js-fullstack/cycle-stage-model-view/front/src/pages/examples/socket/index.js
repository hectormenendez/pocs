import Isolate from '@cycle/isolate';

import Stage from './stage';
import Model from './model';
import View  from './view.jsx';

export function main(sources){

    const stage = Stage(sources);
    stage.sink  = stage.sink || {};

    const { state$, vnode$ } = Model(stage);

    const vtree$  = vnode$
        .map(vnode => state$.map(state => View(state, vnode)))
        .flatten();

    return Object.assign({ state$, DOM: vtree$ }, stage.sink);
}

export default sources => Isolate(main)(sources);
