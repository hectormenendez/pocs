import PropTypes from 'prop-types';
import { Factory } from '@gik/redux-factory';

export const Name = 'ERROR';

export const Types = PropTypes.shape({
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
});

export const State = null;

export const { Actions, Reducers } = Factory(State, {

    show: {
        action: (type, err) => dispatch => dispatch({ type, payload: err }),
        reducer: (prevState, err) => err,
    },

    hide: {
        action: type => dispatch => dispatch({ type }),
        reducer: () => null,
    },

}, Name);
