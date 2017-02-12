import Isolate from '@cycle/isolate';

import Stage from './stage';
import Model from './model';
import View  from './view.jsx';

export function main(sources){

    const { intent, sink } = Stage(sources);
    const model$ = Model(intent, sources);
    const vtree$ = model$.map(({state,vnode}) => View(state, vnode));

    return Object.assign({ DOM: vtree$ }, sink || {});
}

export default sources => Isolate(main)(sources);
