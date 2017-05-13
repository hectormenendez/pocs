import $ from 'xstream';
import Routes from '../routes.json';

export default ({ debug, intent }) => {
    // The initial state
    const state = { routes: Routes };
    // Reducer functions applied  to modify the state
    const reduce = {};
    reduce.whenNavClick = intent.navclick$.map(href => state => state);

    // The State stream sent as sink
    const State = $
        .merge(...Object.values(reduce))
        .fold((state, when) => when(state), state)
        .debug(state => debug('state', state));

    return { State };
}
