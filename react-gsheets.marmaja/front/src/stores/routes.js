import PropTypes from 'prop-types';
import { Factory } from '@gik/redux-factory';

export const Name = 'ROUTES';

export const Types = PropTypes.array.isRequired;

export const Store = [];

export const { Actions, Reducers } = Factory(Store, {

    init: {
        action: (type, routes) => dispatch => dispatch({ type, payload: routes }),
        reducer: (prevState, routes) => routes,
    },

}, Name);
