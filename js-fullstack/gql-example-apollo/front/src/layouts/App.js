import React, { Component } from 'react';
import { Route, Switch as RouteSwitch } from 'react-router-dom';

import Header from 'components/Header';
import ContactList from 'components/Contact/List';
import ContactDetail from 'components/Contact/Detail';

export default class App extends Component {

    render() { // eslint-disable-line class-methods-use-this
        return <section>
            <Header/>
            <RouteSwitch>
                <Route exact={ true } path="/" component={ ContactList } />
                <Route path="/contact/:id" component={ ContactDetail } />
            </RouteSwitch>
        </section>;
    }

}
