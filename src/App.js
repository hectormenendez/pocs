// Modules (production)
import React from 'react';
import { SafeAreaView } from 'react-native';
import { createStore as CreateStore, combineReducers as CombineReducers } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools as ComposeWithDevTools } from 'redux-devtools-extension';

import { Reducers as ReducersTodoist } from '~/states/todoist';
import Loading from '~/components/loading';

const Reducers = CombineReducers({
    todoist: ReducersTodoist,
});

const Store = CreateStore(
    Reducers,
    {}, // Initial State
    __DEV__ && ComposeWithDevTools({})(), // eslint-disable-line no-undef
);

export const Component = () => {

    const state = Store.getState();

    return <Provider store={Store}>
        <Loading />
    </Provider>;
}

Object.defineProperty(Component, 'name', { value: 'App' });
export default Component;
