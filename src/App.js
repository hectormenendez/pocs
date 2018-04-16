// Modules (production)
import React from 'react';
import Locale from 'antd-mobile/lib/locale-provider/en_US';
import Thunk from 'redux-thunk';
import { LocaleProvider } from 'antd-mobile';
import { Provider } from 'react-redux';
import {
    createStore as CreateStore,
    combineReducers as CombineReducers,
    applyMiddleware as ApplyMiddleware,
} from 'redux';

import { composeWithDevTools as ComposeWithDevTools } from 'redux-devtools-extension';

import { Reducers as ReducersTodoist } from '~/states/todoist';
import { Reducers as ReducersSelected } from '~/states/selected';

import PageIndex from '~/pages';

const ReduxMiddleware = ApplyMiddleware(Thunk);

const Store = CreateStore(
    // Root reducer
    CombineReducers({
        todoist: ReducersTodoist,
        selected: ReducersSelected,
    }),
    // initial state
    {},
    // Middleware
    __DEV__ // eslint-disable-line no-undef
        ? ComposeWithDevTools({})(ReduxMiddleware)
        : ReduxMiddleware,
);

export const Component = () =>
    <Provider store={Store}>
        <LocaleProvider locale={Locale}>
            <PageIndex />
        </LocaleProvider>
    </Provider>;

Object.defineProperty(Component, 'name', { value: 'App' });
export default Component;
