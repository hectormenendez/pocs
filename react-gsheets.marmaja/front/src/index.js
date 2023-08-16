import React from 'react';
import ReactDOM from 'react-dom';
import CreateHistory from 'history/createBrowserHistory';
import { AppContainer } from 'react-hot-loader';
import { routerMiddleware as ReduxRouterMiddleware } from 'react-router-redux';
import { Store as CreateStore } from '@gik/redux-factory';

import App from '~/app';
import RegisterServiceWorker from '~/utils/registerServiceWorker';
import { Reducers } from '~/stores';

export const History = CreateHistory();
export const Store = CreateStore(Reducers, {}, [ReduxRouterMiddleware(History)]);

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementsByTagName('main')[0],
    );
};

render(App);

if (module.hot) {
    module.hot.accept('./app', () => { render(App); });
    module.hot.accept('./stores/index', () => {
        const { Reducers: NextReducers } = require('./stores');
        Store.replaceReducer(NextReducers);
    });
}

RegisterServiceWorker();
