
// Enabled for localhost:8000
const Settings = {
    apiKey: 'AIzaSyDHA4Dru_MbjGqUmla47OG9a97LGloKQZg',
    clientId: '84228066695-6q1m2q82mb4i467n0raiuk8pp272lnrn.apps.googleusercontent.com',
    // Array of API discovery doc URLs for APIs used by the quickstart
    discoveryDocs: ["https://script.googleapis.com/$discovery/rest?version=v1"],
    // Authorization scopes required by the API;
    // Multiple scopes can be included, separated by spaces.
    scope: 'https://www.googleapis.com/auth/script.projects',
};

/**
 * @todo The script currently would load the script everytime the function is called
 *       Implement a checker so this is avoided, and the promise can always return the
 *       gapi object. (to avoid using a global, which is a bad idea).
 */
export default (options) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.defer = true;
    // when the Auth client has loaded
    const onAuthClientLoad = function(){
        // initialize the client
        window.gapi.client
            .init(Settings)
            // the client is loaded return it so the caller applies logic to it.
            .then(() => {
                const googleAPI = window.gapi;
                window.gapi = undefined;
                resolve(googleAPI);
            })
    }
    // when loaded resolve and reset the event.
    script.onload = function(){
        this.onload = function(){};
        window.gapi.load('client:auth2', onAuthClientLoad);
    }
    // IE only.
    script.onreadystatechange = function(){
        if (this.readyState === 'complete') this.onload();
    }
    // Create the element and start loading the script.
    const sibling = document.getElementsByTagName('script')[0];
    sibling.parentNode.insertBefore(script, sibling);
});