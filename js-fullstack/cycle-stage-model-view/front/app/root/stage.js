import Debug from 'debug';

const debug = Debug('root');

export default (sources) => ({
    debug,
    intent: {
        // Everytime the user clicks in an navigation item
        navclick$: sources.DOM
            .select('header nav a')
            .events('click')
            .debug(e => e.preventDefault())
            .map(e => e.target.getAttribute('href'))
            .debug(href => debug('intent.navclick$', href))
    }
});
