import PropTypes from 'prop-types';

// Once the library is loaded, populate this with it. (to avoid having a global)
let GoogleAPI;

export default function Load(settings) {

    PropTypes.checkPropTypes({
        apiKey: PropTypes.string.isRequired,
        clientId: PropTypes.string.isRequired,
        discoveryDocs: PropTypes.arrayOf(PropTypes.string).isRequired,
        scope: PropTypes.string.isRequired,
    }, settings, 'settings', 'GoogleAPI');

    const el = document.getElementById('__GoogleAPI__');
    if (el && GoogleAPI) return Promise.resolve(GoogleAPI);
    if (el && !GoogleAPI) return Promise.reject(new Error('Already requested GoogleAPI.'));
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = '__GoogleAPI__';
        script.src = 'https://apis.google.com/js/api.js';
        script.defer = true;
        // when loaded, initialize the client.
        script.onload = () => window.gapi.load('client:auth2', () => window.gapi.client
            .init(settings)
            .then(() => {
                GoogleAPI = window.gapi;
                window.gapi = undefined;
                resolve(GoogleAPI);
            }),
        );
        // IE only.
        script.onreadystatechange = function onReady() {
            if (this.readyState === 'complete') this.onload();
        };
        // Create the element and start loading the script.
        const sibling = document.getElementsByTagName('script')[0];
        sibling.parentNode.insertBefore(script, sibling);
    });
}
