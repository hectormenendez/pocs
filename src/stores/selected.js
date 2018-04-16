import PropTypes from 'prop-types';
import { Factory } from '~/utils/redux';

export const Name = 'SELECTED';

export const Types = PropTypes.shape({
    item: PropTypes.object,
    time: PropTypes.number,
});

export const State = {
    item: null,
    time: null,
};

export const { Actions, Reducers } = Factory(State, {

    setItem: {
        action: (type, payload) => dispatch => dispatch({ type, payload }),
        reducer: (state, item) => ({ time: State.time, item }),
    },

    setTime: {
        action: (type, payload) => dispatch => dispatch({ type, payload }),
        reducer: (state, time) => ({ ...state, time }),
    },

    del: {
        action: (type, payload) => dispatch => dispatch({ type, payload }),
        reducer: () => State,
    },

}, Name);
