import PropTypes from 'prop-types';

import { Factory } from '~/utils/redux';
import { Actions as ActionsGomodoro } from '~/stores/gomodoro';

export const Name = 'SELECTED';

export const Types = PropTypes.shape({
    item: PropTypes.object,
    time: PropTypes.number,
    gomodoro: PropTypes.number,
});

export const State = {
    item: null,
    time: null,
    gomodoro: null,
};

export const { Actions, Reducers } = Factory(State, {

    setItem: {
        action: (type, payload) => dispatch => dispatch({ type, payload }),
        reducer: (state, item) => ({ time: State.time, item }),
    },

    // The user selected a gomodoro, obtain the corresponding time and set it.
    setTime: {

        action: (type, gomodoro) => dispatch => dispatch(ActionsGomodoro.get())
            .then(({ payload: gomodoros }) => dispatch({
                type,
                payload: {
                    gomodoro,
                    time: gomodoros[gomodoro] * 60 * 1000,
                },
            })),

        reducer: (prevState, { time, gomodoro }) => ({ ...prevState, time, gomodoro }),

    },

    reset: {
        action: type => dispatch => dispatch({ type }),
        reducer: () => State,
    },

}, Name);
