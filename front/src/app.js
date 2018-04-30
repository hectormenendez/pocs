import React from 'react';
import LocaleEnUS from 'antd/lib/locale-provider/en_US';
import { Provider } from '@gik/redux-factory';
import { LocaleProvider } from 'antd';
import { ConnectedRouter as ReduxRouter } from 'react-router-redux';

import { Store, History } from '~';
import Pages from '~/pages';
import GoogleAPI from '~/utils/gapi';
import SettingsRoutes from '~/settings/routes';
import ComponentLoader from '~/components/loader';
import { API as SettingsGoogle } from '~/settings/google';
import { Actions as ActionsGoogle } from '~/stores/google';
import { Actions as ActionsRoutes } from '~/stores/routes';

import './index.css';

export class Component extends React.Component {

    state = { ready: false };

    componentDidMount() {
        GoogleAPI(SettingsGoogle).then((gapi) => {
            // initialize the Google API for scripts once its loaded
            Store.dispatch(ActionsGoogle.init(gapi));
            // Initilize the routes
            Store.dispatch(ActionsRoutes.init(SettingsRoutes));
            // force an update
            this.setState({ ready: true });
        });
    }


    // eslint-disable-next-line class-methods-use-this
    render() {
        if (!this.state.ready) return <ComponentLoader/>;
        return <Provider store={Store}>
            <LocaleProvider locale={LocaleEnUS}>
                <ReduxRouter history={History}>
                    <Pages/>
                </ReduxRouter>
            </LocaleProvider>
        </Provider>;
    }

}

export default Component;

