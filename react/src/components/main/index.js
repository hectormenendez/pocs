import React from 'react';
import { Spin, Button } from 'antd';
import GoogleAPI from '~/utils/gapi';

import './index.css';

var API; // this will be populated with the GoogleAPI client once is loaded.

// default state
const State = {
    isGoogleReady: null,
    isUserAuthenticated: null,
};

export default class extends React.Component {

    state = State; // initialize the state with defaults.

    componentDidMount() {
        // Initialize the google API
        GoogleAPI().then(gapi => {
            API = gapi;
            const instance = API.auth2.getAuthInstance();
            // Let know the state that we're ready to roll
            this.setState({ isGoogleReady: true });
            // Setup a listener so we know when the user authenticates
            instance.isSignedIn.listen(this.handleAuthStatus);
            // Get the initial Authentication state
            this.handleAuthStatus(instance.isSignedIn.get());
        });
    }

    /**
     * @todo Use components instead of elements.
     */
    render() {
        if (!this.state.isGoogleReady)
            return <section className="Spin"><Spin size="large"/></section>
        if (this.state.isGoogleReady && !this.state.isUserAuthenticated)
            return <section className="Login">
                <Button type="primary" onClick={this.handleAuthLogin}>Login</Button>
            </section>;

        return <section>
            <Button type="primary" onClick={this.handleRun}>Run</Button>
            <Button type="secondary" onClick={this.handleAuthLogout}>Logout</Button>
        </section>;
    }

    // Callback for API client's listener that verifies the status of the authentication
    handleAuthStatus = (isUserAuthenticated) => this.setState({ isUserAuthenticated });

    // Callback for button that triggers Google Authentication process.
    handleAuthLogin = () => API.auth2.getAuthInstance().signIn();

    // Callback for button that logs the user out.
    handleAuthLogout = () => API.auth2.getAuthInstance().signOut();

    handleRun = () => {
        API.client.script.scripts
            .run({
                scriptId: 'M_VxGmzjDQco4epsaDzbnidEPgpVJ72BN',
                resource: {
                    function: 'myFunction',
                    parameters: ['this is a test'],
                    devMode: true,
                }
            })
            .then(x => {
                console.log('x', x);
            })
    }
}