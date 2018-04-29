import PropTypes from 'prop-types';
import { Factory } from '@gik/redux-factory';

import { ScriptId, DevMode } from '~/settings/google';
import { Actions as ActionsErrors } from '~/stores/error';

export const Name = 'GOOGLE';

export const Types = {
    ready: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    session: PropTypes.object,
};

export const State = {
    ready: false,
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
        action: (type, { method, params }) => dispatch => GoogleAPI
            .client.script.scripts.run({
                scriptId: ScriptId,
                resource: {
                    function: method,
                    parameters: params,
                    devMode: DevMode,
                },
            })
            .then(({ result }) => {
                if (result.error) {
                    // eslint-disable-next-line no-console
                    result.error.details.forEach(detail => console.error(detail));
                    return dispatch(ActionsErrors.show({
                        name: `ErrorGoogleAPI: ${result.error.message}`,
                        message: result.error.details[0].errorMessage,
                    }));
                }
                return result.response.result;
            })
            // if an error is found, dispatch it and return null to the caller.
            .catch((response) => {
                /* eslint-disable prefer-destructuring */
                let name;
                let message;
                if (response instanceof Error) {
                    name = response.name;
                    message = response.message;
                    console.error(response); // eslint-disable-line no-console
                } else if (response.result) {
                    name = response.result.error.status;
                    message = response.result.error.message;
                }
                /* eslint-enable prefer-destructuring */
                dispatch(ActionsErrors.show({
                    name: `ErrorGoogleAPI: ${name}`,
                    message,
                }));
                return null;
            }),
    },

}, Name);
