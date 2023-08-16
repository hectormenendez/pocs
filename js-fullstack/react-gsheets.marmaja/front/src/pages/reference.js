import React from 'react';
import { Layout } from 'antd';

import GoogleAPI from '~/utils/gapi';

import { Route, Switch as RouteSwitch } from 'react-router-dom';

import Loader from '~/components/loader';
import Login from '~/components/login';
import Accounts from '~/layouts/accounts';
import Transfers from '~/layouts/transfers';

import Header from './header';
import Footer from './footer';
import Content from './content';

// default state
const State = {
    isGoogleReady: null,
    isUserAuthenticated: null,
};

export default class ComponentLayout extends React.Component {

    state = State;

    componentDidMount() {
        // Initialize the google API
        GoogleAPI().then((gapi) => {
            const instance = gapi.auth2.getAuthInstance();
            // Let know the state that we're ready to roll
            this.setState({ isGoogleReady: true });
            // Setup a listener so we know when the user authenticates
            instance.isSignedIn.listen(this.handleAuthStatus);
            // Get the initial Authentication state
            this.handleAuthStatus(instance.isSignedIn.get());
        });
    }

    render() {
        return !this.state.isGoogleReady
            ? <Loader />
            : <Layout>
                <Header/>
                {!this.state.isUserAuthenticated
                    ? <Login onClick={this.handleAuthLogin}/>
                    : <RouteSwitch>
                        <Route
                            name="home"
                            path="/"
                            exact={true}
                            component={Content}/>
                        <Route
                            name="accounts"
                            path="/accounts"
                            exact={true}
                            component={Accounts}/>
                        <Route
                            name="transfers"
                            path="/transfers"
                            exact={true}
                            component={Transfers}/>
                    </RouteSwitch>
                }
                <Footer/>
            </Layout>;
    }

    // Callback for API client's listener that verifies the status of the authentication
    handleAuthStatus = isUserAuthenticated => this.setState({ isUserAuthenticated });

    // Callback for button that triggers Google Authentication process.
    handleAuthLogin = () => GoogleAPI()
        .then(gapi => gapi.auth2.getAuthInstance().signIn());

    // Callback for button that logs the user out.
    handleAuthLogout = () => GoogleAPI()
        .then(gapi => gapi.auth2.getAuthInstance().signOut());
}
// <Layout.Content className={Styles.Content}>
//                         <Breadcrumbs/>
//                         <section>
//                             <Router />
//                         </section>
//                     </Layout.Content>
