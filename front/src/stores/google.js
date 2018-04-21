import PropTypes from 'prop-types';
import { Factory } from '@gik/redux-factory';

export const Name = 'GOOGLE';

export const Types = {
    isSignedIn: PropTypes.bool.isRequired,
    session: PropTypes.object,
};

export const State = {
    isSignedIn: false,
    session: null,
};

let GoogleAPI;

export const { Actions, Reducers } = Factory(State, {

    init: {
        action: (type, gapi) => (dispatch) => {
            GoogleAPI = gapi;
            const auth = GoogleAPI.auth2.getAuthInstance();
            // This listener will update the reducer hanfling signin.
            auth.isSignedIn
                .listen(isSignedIn => dispatch({ type, payload: isSignedIn }));
            // dispatch the initial reducer.
            return dispatch({ type, payload: auth.isSignedIn.get() });
        },
        reducer: (prevState, isSignedIn) => ({ ...prevState, isSignedIn }),
    },

    logout: {
        action: type => dispatch => GoogleAPI.auth2
            .getAuthInstance()
            .signOut()
            .then(() => dispatch({ type })),
        reducer: prevState => ({ ...prevState, session: null }),
    },

    login: {
        action: type => dispatch => GoogleAPI.auth2
            .getAuthInstance()
            .signIn()
            .then(session => dispatch({ type, payload: session.Zi })),
        reducer: (prevState, session) => ({ ...prevState, session }),
    },

    run: {
        action: (type, { scriptId, method, params }) => () =>
            GoogleAPI.client.script.scripts
                .run({ scriptId, resource: { function: method, params, devMode: true } })
                .then(({ result }) => result.response.result),
    },

}, Name);
