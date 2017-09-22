// Local modules
import View from './view';
import Intent from './intent';
import Model from './model';

export default function App(sources) {
    const intent = Intent(sources.DOM);
    const reducer$ = Model(intent);
    const dom$ = sources.onion.state$.map(View);
    return {
        DOM: dom$,
        onion: reducer$,
    };
}
