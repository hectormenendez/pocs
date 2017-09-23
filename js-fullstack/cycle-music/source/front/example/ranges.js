// NPM modules
import $ from 'xstream';
import Snabbdom from 'snabbdom-pragma';
import Isolate from '@cycle/isolate';
import { mix as Mix, pick as Pick } from 'cycle-onionify';
// Local modules
import ComponentRange from './range';

export default function ComponentRanges(sources) {

    const { state$ } = sources.onion;
    const collection$ = state$
        .map(state => state
            .map((stateRange, i) => Isolate(ComponentRange, i)(sources)));
    const collectionOnion$ = collection$
        .compose(Pick('onion'))
        .compose(Mix($.merge));
    const collectionDOM$ = collection$
        .compose(Pick('DOM'))
        .compose(Mix($.combine));

    return {
        DOM: collectionDOM$,
        onion: collectionOnion$,
    };
}
