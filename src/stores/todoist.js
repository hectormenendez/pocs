import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';

import Config from '~/utils/config.json';

import { Read } from '~/utils/todoist';
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

    itemsFetch: {
        action: type => dispatch => AsyncStorage
            // Determine if there's something on the storage
            .getItem(Config.storeKey)
            .then(serializedStorage => serializedStorage
                ? JSON.parse(serializedStorage) // storage found, unserialize it.
                : { sync: '*', items: [] }, // no previous storage, setup first fetch.
            )
            // Combine the storage and the updated states
            .then(storage => Read(storage.sync, ['items'])
                .then(({ sync, items }) => ({
                    sync,
                    items: storage.items.concat(items),
                })),
            )
            // Update the storage with the new merged state.
            .then(payload => AsyncStorage
                .setItem(Config.storeKey, JSON.stringify(payload))
                .then(() => dispatch({ type, payload })),
            ),

        // Since the action did all the operations, just replace the store.
        reducer: (prevState, payload) => payload,
    },

}, Name);
