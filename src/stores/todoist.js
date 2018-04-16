import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';

import Config from '~/utils/config.json';

import { Read, Write } from '~/utils/todoist';
import { Factory } from '~/utils/redux';
import { MilliToHuman } from '~/utils/time';

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
                .then(response => ({
                    sync: response.sync_token,
                    items: storage.items.concat(response.items),
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

    itemComplete: {
        action: (type, payload) => (dispatch) => {
            const orig = MilliToHuman(payload.time.orig);
            const time = MilliToHuman(payload.expired
                ? payload.time.orig + payload.time.curr
                : payload.time.orig - payload.time.curr);
            const tasks = [
                ['note_add', {
                    item_id: payload.item.id,
                    content: `**Estimated:** ${orig} **Actual:** ${time}`,
                }],
                ['item_complete', {
                    ids: [payload.item.id],
                    force_history: 1,
                }],
            ];
            return Write(tasks)
                // get rid of the item in the storage
                .then(response => AsyncStorage
                    .getItem(Config.storeKey)
                    .then(serializedStorage => JSON.parse(serializedStorage))
                    .then(storage => ({ storage, response })),
                )
                .then(({ storage, response }) => {
                    const state = {
                        sync: response.sync_token,
                        items: storage.items.filter(item => item.id !== payload.item.id),
                    };
                    return AsyncStorage
                        .setItem(Config.storeKey, JSON.stringify(state))
                        .then(() => state);
                })
                .then(({ sync, items }) => dispatch({ type, payload: { sync, items } }));
        },

        reducer: (prevState, payload) => payload,
    },

}, Name);
