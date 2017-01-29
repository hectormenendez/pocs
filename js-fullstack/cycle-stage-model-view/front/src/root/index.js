import Model  from './model';
import View   from './view';
import Intent from './intent';

export default sources => {
    const intent = Intent(sources);
    const state$ = Model(intent);
    const vtree$ = state$.map(View);

    return {
        DOM: vtree$
    }
}
