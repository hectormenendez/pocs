import React, { Component } from 'react';

import Contacts from 'Contacts';
import AddContact from 'AddContact';

export default class App extends Component {

    render() { // eslint-disable-line class-methods-use-this
        return <div className="App">
            <header className="App-header">
                <h1>CRM</h1>
            </header>
            <AddContact />
            <Contacts />
        </div>;
    }

}
