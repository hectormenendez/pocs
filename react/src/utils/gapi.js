// Enabled for localhost:8000
const Settings = {
    // Credentials needed to access the service
    apiKey: 'AIzaSyCIDOW4w30lvezMIxOLmWpu0FPfRFPW5ok',
    clientId: '352671104011-s088b7hohuemalpkm3dajuvml66v37tn.apps.googleusercontent.com',
    // Connect to the correct API endpoints
    discoveryDocs: ['https://script.googleapis.com/$discovery/rest?version=v1'],
    // Authorization scopes required by the API;
    scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/spreadsheets',
    ].join(' '),
};

const ScriptSettings = {
    id: 'M_VxGmzjDQco4epsaDzbnidEPgpVJ72BN',
    devMode: true,
};

/**
 * @todo The script currently would load the script everytime the function is called
 *       Implement a checker so this is avoided, and the promise can always return the
 *       gapi object. (to avoid using a global, which is a bad idea).
 */
export default () => new Promise((resolve, reject) => {
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
                const API = window.gapi;
                window.gapi = undefined; // NOTE: This is me being stubborn.
                // Add a shorthand for calling the scripts
                API.shorthands = {
                    run: ({ func, params }) => API.client.script.scripts
                        .run({
                            scriptId: ScriptSettings.id,
                            resource: {
                                function: func,
                                parameters: params,
                                devMode: ScriptSettings.devMode,
                            }
                        })
                        .then(({ result }) => result.response.result ),
                };
                resolve(API);
            });
    };
    // when loaded resolve and reset the event.
    script.onload = function(){
        this.onload = function(){};
        window.gapi.load('client:auth2', onAuthClientLoad);
    };
    // IE only.
    script.onreadystatechange = function(){
        if (this.readyState === 'complete') this.onload();
    };
    // Create the element and start loading the script.
    const sibling = document.getElementsByTagName('script')[0];
    sibling.parentNode.insertBefore(script, sibling);
});
