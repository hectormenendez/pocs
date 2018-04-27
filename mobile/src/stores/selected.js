import PropTypes from 'prop-types';

import { Store } from '~/App';
import { Factory } from '~/utils/redux';
import { Actions as ActionsGomodoro } from '~/stores/gomodoro';

export const Name = 'SELECTED';

export const Types = PropTypes.shape({
    item: PropTypes.object,
    time: PropTypes.number,
});

export const State = {
    item: null,
    gomodoro: {
        time: null,
        unit: null,
    },
};

export const { Actions, Reducers } = Factory(State, {

    setItem: {
        action: (type, payload) => dispatch => dispatch({ type, payload }),
        reducer: (state, item) => ({ time: State.time, item }),
    },

    // The user selected a gomodoro, obtain the corresponding time and set it.
    setTime: {

        action: (type, gomodoro) => dispatch => Store
            .dispatch(ActionsGomodoro.get())
            .then(({ payload: gomodoros }) => dispatch({
                type,
                payload: gomodoros[gomodoro] * 60 * 1000,
            })),

        reducer: (prevState, time) => ({ ...prevState, time }),

    },

    reset: {
        action: type => dispatch => dispatch({ type }),
        reducer: () => State,
    },

}, Name);
