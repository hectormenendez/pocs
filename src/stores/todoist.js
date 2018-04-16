import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';

import Config from '~/utils/config.json';

import Todoist from '~/utils/todoist';
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

    // first get items on local storage, then call todoist for updates.
    itemsFetch: {
        action: type => dispatch => AsyncStorage
            .getItem(Config.storeKey)
            .then((storedValue) => {
                let syncID = '*';
                if (storedValue) {
                    const state = JSON.parse(storedValue);
                    syncID = state.sync;
                    dispatch({ type, payload: state });
                }
                return Todoist(syncID);
            })
            .then(({ sync, items }) => dispatch({ type, payload: { sync, items } })),
        reducer: (prevState, { sync, items }) => {
            const nextState = { sync, items: prevState.items.concat(items) };
            AsyncStorage.setItem(Config.storeKey, JSON.stringify(nextState));
            return nextState;
        },
    },

}, Name);
