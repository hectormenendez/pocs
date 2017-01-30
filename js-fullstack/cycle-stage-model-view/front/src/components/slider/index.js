import Isolate from '@cycle/isolate';

import Model  from './model';
import View   from './view';
import Intent from './intent';

function main(sources){
    const intent = Intent(sources);
    const state$ = Model(intent, sources);
    const vtree$ = View(state$);
    return {
        state$,
        DOM: vtree$
    }
}

export default function(sources){
    return Isolate(main)(sources);
}
