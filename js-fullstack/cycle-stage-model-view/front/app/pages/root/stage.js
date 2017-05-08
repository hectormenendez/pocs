import $ from 'xstream';
import Debug from 'debug';

export default (sources) => ({
    // use this method for sending messages to the console
    debug: Debug('app:root'),
    // The intentions available to the model
    intent: {
        // Clicked link on the list.
        click$: sources.DOM
            .select('a')
            .events('click')
            .debug(e => e.preventDefault())
            .map(e => e.target.getAttribute('href'))
    }
});
