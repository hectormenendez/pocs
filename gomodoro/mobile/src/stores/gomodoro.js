import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';

import { Factory } from '~/utils/redux';
import Config from '~/utils/config.json';

export const Name = 'GOMODORO';

export const StoreKey = `${Config.storekey}:${Name}`;

export const Types = PropTypes.object.isRequired;

export const State = [1, 2, 3, 5, 8]
    // The default time settings for the gomodoros
    // 1: 12, 2:36, 3:72, 5:144, 8:264
    .reduce((acc, cur, i, arr) => {
        if (i === 0) return { [cur]: 12 };
        const val = Math.ceil(
            (acc[arr[i - 1]] * (1 + (1 / (arr.length + 1)))) + (acc[arr[0]] * cur),
        );
        return Object.assign(acc, { [cur]: val - (val % acc[arr[0]]) });
    }, null);


export const { Actions, Reducers } = Factory(State, {

    get: {
        action: type => dispatch => AsyncStorage
            .getItem(StoreKey)
            .then((storage) => {
                if (!storage) return AsyncStorage // eslint-disable-line curly
                    .setItem(StoreKey, JSON.stringify(State))
                    .then(() => State);
                return JSON.parse(storage);
            })
            .then(state => dispatch({ type, payload: state })),

        reducer: (prevState, state) => state,
    },

    set: {
        action: (type, payload) => dispatch => dispatch(Actions.get())
            .then(({ payload: state }) => {
                // determine the average time using the new information
                const nextState = Object
                    .keys(payload)
                    .reduce((acc, key) => ({
                        [key]: Math.ceil((
                            state[key] +
                            ((payload[key] / 1000) / 60)
                        ) / 2),
                    }), state);
                return AsyncStorage
                    .setItem(StoreKey, JSON.stringify(nextState))
                    .then(() => dispatch({ type, payload: nextState }));
            }),

        reducer: (prevState, state) => state,
    },
}, Name);
