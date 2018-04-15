// Modules (production)
import React from 'react';
import Locale from 'antd-mobile/lib/locale-provider/en_US';
import { createStore as CreateStore, combineReducers as CombineReducers } from 'redux';
import { LocaleProvider } from 'antd-mobile';
import { Provider } from 'react-redux';

import { composeWithDevTools as ComposeWithDevTools } from 'redux-devtools-extension';

import { Reducers as ReducersTodoist } from '~/states/todoist';
import { Reducers as ReducersSelected } from '~/states/selected';

import PageIndex from '~/pages';

const Reducers = CombineReducers({
    todoist: ReducersTodoist,
    selected: ReducersSelected,
});

const Store = CreateStore(
    Reducers,
    {}, // Initial State
    __DEV__ && ComposeWithDevTools({})(), // eslint-disable-line no-undef
);

export const Component = () =>
    <Provider store={Store}>
        <LocaleProvider locale={Locale}>
            <PageIndex />
        </LocaleProvider>
    </Provider>;

Object.defineProperty(Component, 'name', { value: 'App' });
export default Component;
