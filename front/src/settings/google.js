export default {
    // Credentials needed to access the service
    apiKey: 'AIzaSyCIDOW4w30lvezMIxOLmWpu0FPfRFPW5ok',
    clientId: '352671104011-s088b7hohuemalpkm3dajuvml66v37tn.apps.googleusercontent.com',
    // Connect to the correct API endpoints
    discoveryDocs: [
        'https://script.googleapis.com/$discovery/rest?version=v1',
    ],
    // Authorization scopes required by the API;
    scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/spreadsheets',
    ].join(' '),
};
