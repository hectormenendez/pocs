import React from 'react';
import { Layout } from 'antd';

import GoogleAPI from '~/utils/gapi';
import Loader from '~/components/loader';
import Login from '~/components/login';
import Router from '~/components/router';

import Styles from './index.module.css';

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
                <Layout.Header className={Styles.Header}>
                    <h1>PoC</h1>
                </Layout.Header>

                {!this.state.isUserAuthenticated
                    ? <Login />
                    : <Router />
                }

                <Layout.Footer className={Styles.Footer}>
                    Footer
                </Layout.Footer>
            </Layout>;
    }

    // Callback for API client's listener that verifies the status of the authentication
    handleAuthStatus = isUserAuthenticated => this.setState({ isUserAuthenticated });
}


// // Callback for button that triggers Google Authentication process.
// handleAuthLogin = () => API.auth2.getAuthInstance().signIn();

// // Callback for button that logs the user out.
// handleAuthLogout = () => API.auth2.getAuthInstance().signOut();
