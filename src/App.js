import React from 'react';
import { Provider } from 'react-redux';
import { createStore as CreateStore, combineReducers as CombineReducers } from 'redux';
import { composeWithDevTools as ComposeWithDevTools } from 'redux-devtools-extension';

import { Reducers as ReducersCount } from '~/states/count';
import PageHome from '~/pages/count';

const Reducers = CombineReducers({
    count: ReducersCount,
});

const ComposedEnhancers = ComposeWithDevTools({})();
const State = {};

const Store = CreateStore(Reducers, State, ComposedEnhancers);

export default () => <Provider store={Store}>
    <PageHome />
</Provider>;
