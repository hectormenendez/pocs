import React from 'react';
import { AsyncStorage, StyleSheet, SafeAreaView } from 'react-native';
import { Button, SearchBar, LocaleProvider, List } from 'antd-mobile';
import EnUS from 'antd-mobile/lib/locale-provider/en_US';
import Config from './config.json';
import Todoist from './util/todoist';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 40,
    },
});

const State = {
    sync: null,
    items: null,
    search: {
        text: '',
        results: [],
    },
};

export default class App extends React.Component {

    state = State;

    componentDidMount() {
        AsyncStorage
            .getItem(Config.storeKey)
            .then((storedValue) => {
                if (storedValue !== null) return JSON.parse(storedValue);
                return Todoist('*') // fetch all items
                    .then(({ sync, items }) => AsyncStorage
                        .setItem(Config.storeKey, JSON.stringify({ sync, items }))
                        .then(() => ({ sync, items })),
                    );
            })
            .then((data) => {
                console.log('x', data);
                this.setState(data);
            })
            .catch(err => console.error(err));
    }

    componentDidUpdate() {
        console.log('did update');
        // AsyncStorage
        //     .setItem('@Gomodoro:state', JSON.stringify({
        //         sync: this.state.sync,
        //         items: this.state.items,
        //     }))
        //     .Catch(err => console.error(err))
        //     .then(() => console.log('Saved state.'));
    }

    render() {
        return <LocaleProvider locale={EnUS}>
            {this.state.sync === null
                ? <SafeAreaView />
                : <SafeAreaView>

                    <SearchBar
                        placeholder="Tasks"
                        maxLength={20}
                        onChange={this.handleSearch}
                    />

                    <List>
                        <List.Item onPress={this.handleFetch}>Test</List.Item>
                        <List.Item>Test</List.Item>
                        <List.Item>Test</List.Item>
                        <List.Item>Test</List.Item>
                        <List.Item>Test</List.Item>
                        <List.Item>Test</List.Item>
                    </List>
                    <Button onClick={this.handleFetch}>Remove</Button>
                    <Button onClick={this.handleShow}>Show</Button>
                </SafeAreaView>}
        </LocaleProvider>;
    }

    /**
     * Fetches items in todoist using the latest sync token stored in the state,
     * and after fetching, it updates the sync token on the state.
     */
    handleFetch = () => {
        AsyncStorage
            .removeItem(Config.storeKey)
            .then(x => console.log('delete', x));
    }

    handleShow = () => {
        AsyncStorage
            .getItem(Config.storeKey)
            .then(x => console.log('show', x));
    }

    handleSearch = (text) => {
        // console.log('state', this.state);
        // const results = this.state.items
        //     .map(item => {
        //         console.log(item);
        //         return item;
        //     })
        //     .filter(item => item.content.toLowerCase().indexOf(text.toLowerCase()) !== -1);
        // console.log('---->', results);
    }

}

