import React from 'react';
import { Button } from 'antd';
import GoogleAPI from '~/utils/gapi';

import './index.css';

// default state
const State = {
    isGoogleReady: null,
    isUserAuthenticated: null,
};

export default class extends React.Component {

    state = State; // initialize the state with defaults.

    componentDidMount() {
        // Initialize the google API
        GoogleAPI().then(googleAPI => {
            // Setup a listener so we know when the user authenticates
            googleAPI.auth2
                .getAuthInstance()
                .isSignedIn.listen(this.handleAuth.bind(this, googleAPI));
            // Let know the state that we're ready to roll
            this.setState({ isGoogleReady: true });
        });
    }

    /**
     * @todo Use components instead of elements.
     */
    render() {
        return !this.state.isGoogleReady
        ? <section>Loading</section>
        : <div className="App">
            <Button type="primary">Button</Button>
        </div>;
    }

    handleAuth = (googleAPI, isUserAuthenticated) => {
        console.log('handleAuth', this, isUserAuthenticated);
    }
}