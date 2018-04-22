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
import { API as SettingsGoogle } from '~/settings/google';
import SettingsRoutes from '~/settings/routes';
import ComponentLoader from '~/components/loader';
import Pages from '~/pages';
import { Reducers as ReducersError } from '~/stores/error';
import { Reducers as ReducersGoogle, Actions as ActionsGoogle } from '~/stores/google';
import { Reducers as ReducersRoutes, Actions as ActionsRoutes } from '~/stores/routes';

const history = History();

const store = Store(
    { // reducers
        google: ReducersGoogle,
        routes: ReducersRoutes,
        error: ReducersError,
    },
    // Initial state
    {},
    // Middleware
    [ReduxRouterMiddleware(history)],
);

class App extends React.Component {

    state = { ready: false };

    componentDidMount() {
        GoogleAPI(SettingsGoogle).then((gapi) => {
            // initialize the Google API for scripts once its loaded
            store.dispatch(ActionsGoogle.init(gapi));
            // Initilize the routes
            store.dispatch(ActionsRoutes.init(SettingsRoutes));
            // force an update
            this.setState({ ready: true });
        });
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        if (!this.state.ready) return <ComponentLoader/>;
        return <Provider store={store}>
            <LocaleProvider locale={LocaleEnUS}>
                <ReduxRouter history={history}>
                    <Pages/>
                </ReduxRouter>
            </LocaleProvider>
        </Provider>;
    }

}

ReactDOM.render(
    <App/>,
    document.getElementsByTagName('main')[0],
);
RegisterServiceWorker();
