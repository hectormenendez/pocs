import PropTypes from 'prop-types';
import { Factory } from '~/utils/redux';

export const Name = 'TODOIST';

export const Types = PropTypes.shape({
    sync: PropTypes.string,
    items: PropTypes.array.isRequired,
});

export const State = {
    sync: null,
    items: [],
};

export const { Actions, Reducers } = Factory(State, {
    add: {
        action: (type, payload) => dispatch => dispatch({ type, payload }),
        reducer: (prevState, payload) => ({
            sync: payload.sync,
            items: prevState.items.concat(payload.items),
        }),
    },
}, Name);
