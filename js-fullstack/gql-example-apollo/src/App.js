import React, { Component } from 'react';
import Contacts from 'Contacts';

class App extends Component {

    render() { // eslint-disable-line class-methods-use-this
        return <div className="App">
            <header className="App-header">
                <h1>CRM</h1>
            </header>
            <Contacts />
        </div>;
    }

}

export default App;
