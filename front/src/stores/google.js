import PropTypes from 'prop-types';
import { Factory } from '@gik/redux-factory';

import { Actions as ActionsErrors } from '~/stores/error';
import { Scripts as ScriptsGoogle } from '~/settings/google';

export const Name = 'GOOGLE';

export const Types = {
    ready: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    session: PropTypes.object,
};

export const State = {
    ready: false,
    isSignedIn: false,
    session: null
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
        reducer: (prevState, isSignedIn) => ({ ...prevState, isSignedIn, ready: true }),
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
        action: (type, { method, params, devMode }) => (dispatch) => {
            const scriptId = ScriptsGoogle[method];
            return GoogleAPI.client.script.scripts
                .run({ scriptId, resource: { function: method, params, devMode } })
                .then(({ result }) => result.response.result)
                // if an error is found, dispatch it and return null to the caller.
                .catch((response) => {
                    dispatch(ActionsErrors.show({
                        name: `ErrorGoogleAPI: ${response.result.error.status}`,
                        message: response.result.error.message,
                    }));
                    return null;
                });
        },
    },

}, Name);
