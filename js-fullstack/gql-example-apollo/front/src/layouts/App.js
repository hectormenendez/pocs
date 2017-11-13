import React, { Component } from 'react';

import Header from 'components/Header';
import ContactList from 'components/ContactList';
import ContactAdd from 'components/ContactAdd';

export default class App extends Component {

    render() { // eslint-disable-line class-methods-use-this
        return <section>
            <Header/>
            <ContactAdd/>
            <ContactList/>
        </section>;
    }

}
