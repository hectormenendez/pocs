import React from 'react';
import { Button, Divider, Input, InputNumber, Select } from 'antd';

import GoogleAPI from '~/utils/gapi';
import Formatters from '~/utils/formatters';
import Parsers from '~/utils/parsers';

import Loader from '~/components/loader';
import Login from '~/components/login';

import Style from './index.module.css';

var API; // this will be populated with the GoogleAPI client once is loaded.

const Option = Select.Option;

// default state
const State = {
    isGoogleReady: null,
    isUserAuthenticated: null,
    types: null,
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

    componentDidUpdate() {
        if (!this.state.isUserAuthenticated) return;
        // Fetch the types from the spreadsheet
        if (!this.state.types) {
            API.shorthands
                .run({ func: 'getTypes' })
                .then(response => this.setState({ types: response }));
        }
    }

    /**
     * @todo Use components instead of elements.
     */
    render() {
        // GoogleAPI is not yet loaded
        if (!this.state.isGoogleReady)
            return <Loader/>;
        // User is not logged in
        if (this.state.isGoogleReady && !this.state.isUserAuthenticated)
            return <Login onClick={this.handleAuthLogin}/>;

        return <section className={Style.Main}>
            <input type="hidden" name="date"/>
            <fieldset>
                <label>Unique Identfier</label>
                <Input/>
            </fieldset>

            <fieldset>
                <label>Name</label>
                <Input/>
            </fieldset>

            <fieldset >
                <label>Description</label>
                <Input/>
            </fieldset>

            <fieldset >
                <label>Owner</label>
                <Select
                    showSearch
                    className={Style.SelectFull}
                    placeholder="Select an owner">
                    <Option value="Test">Test</Option>
                </Select>
            </fieldset>

            <fieldset >
                <label>Type</label>
                {!this.state.types
                    ? <Input disabled placeholder="Loading…" />
                    : <Select
                        showSearch
                        className={Style.SelectFull}
                        placeholder="Select a type">
                        {this.state.types.map(({key, value}, i) =>
                            <Option key={`option-${i}`} value={value}>{key}</Option>
                        )}
                    </Select>}
            </fieldset>

            <fieldset >
                <label>Initial Balance</label>
                <InputNumber
                    defaultValue={0}
                    formatter={Formatters.currency}
                    parser={Parsers.currency}
                />
                <Select
                    showSearch
                    className={Style.SelectMin}
                    defaultValue="MXN">
                    <Option value="MXN">MXN</Option>
                </Select>
            </fieldset>

            <Divider />

            <Button type="secondary" onClick={this.handleAuthLogout}>Logout</Button>
        </section>;
    }

    // Callback for API client's listener that verifies the status of the authentication
    handleAuthStatus = (isUserAuthenticated) => this.setState({ isUserAuthenticated });

    // Callback for button that triggers Google Authentication process.
    handleAuthLogin = () => API.auth2.getAuthInstance().signIn();

    // Callback for button that logs the user out.
    handleAuthLogout = () => API.auth2.getAuthInstance().signOut();

}
