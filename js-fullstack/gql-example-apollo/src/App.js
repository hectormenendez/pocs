import React, { Component } from 'react';
import Contacts from 'Contacts';

export default class App extends Component {

    render() { // eslint-disable-line class-methods-use-this
        return <div className="App">
            <header className="App-header">
                <h1>CRM</h1>
            </header>
            <Contacts />
        </div>;
    }

}
