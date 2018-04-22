export const API = {
    // Credentials needed to access the service
    apiKey: '',
    clientId: '',
    // Connect to the correct API endpoints
    discoveryDocs: [
        'https://script.googleapis.com/$discovery/rest?version=v1',
    ],
    // Authorization scopes required by the API;
    scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/spreadsheets',
    ].join(' '),
};

export const Scripts = {

    // methodName: 'methodId',

};

export default { api: API, scripts: Scripts };
