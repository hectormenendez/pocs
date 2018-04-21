import React from 'react';
import ReactDOM from 'react-dom';
import LocaleEnUS from 'antd/lib/locale-provider/en_US';
import History from 'history/createBrowserHistory';
import { Store, Provider } from '@gik/redux-factory';
import { LocaleProvider } from 'antd';
import {
    ConnectedRouter as ReduxRouter,
    routerMiddleware as ReduxRouterMiddleware,
} from 'react-router-redux';

import RegisterServiceWorker from '~/utils/registerServiceWorker';
import GoogleAPI from '~/utils/gapi';
import { Reducers as ReducersGoogle, Actions as ActionsGoogle } from '~/stores/google';
import { Reducers as ReducersRoutes, Actions as ActionsRoutes } from '~/stores/routes';

import Pages from '~/pages';
import SettingsGoogle from '~/settings/google';
import SettingsRoutes from '~/settings/routes';

const history = History();

const store = Store(
    { // reducers
        google: ReducersGoogle,
        routes: ReducersRoutes,
    },
    { // Initial state
        google: null,
        routes: null,
    },
    [ReduxRouterMiddleware(history)],
);

GoogleAPI(SettingsGoogle).then((gapi) => {

    // initialize the Google API for scripts once its loaded
    store.dispatch(ActionsGoogle.init(gapi));

    // Initilize the routes
    store.dispatch(ActionsRoutes.init(SettingsRoutes));

    ReactDOM.render(
        <Provider store={store}>
            <LocaleProvider locale={LocaleEnUS}>
                <ReduxRouter history={history}>
                    <Pages />
                </ReduxRouter>
            </LocaleProvider>
        </Provider>,
        document.getElementsByTagName('main')[0],
    );
});
RegisterServiceWorker();
