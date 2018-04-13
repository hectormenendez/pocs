import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import { Button } from 'antd-mobile';

import Config from './config.json';

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

Config.endpoint = 'https://todoist.com/api/v7/sync';

const Request = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: {
        token: Config.token,
        resource_types: JSON.stringify(['items']),
    },
};

export default class App extends React.Component {

    state = {
        sync: '*',
        items: [],
    };

    componentDidMount() {
        AsyncStorage
            .getItem('@Gomodoro:state')
            .then(string => JSON.parse(string))
            .then(state => this.setState(state));
    }

    componentDidUpdate() {
        console.log('did update');
        // AsyncStorage
        //     .setItem('@Gomodoro:state', JSON.stringify({
        //         sync: this.state.sync,
        //         items: this.state.items,
        //     }))
        //     .catch(err => console.error(err))
        //     .then(() => console.log('Saved state.'));
    }

    render() {
        return (
            <View style={styles.container}>
                <Button
                    type="primary"
                    onPress={this.handleFetch}>
                    Fetch
                </Button>
                <Text style={styles.text}>{this.state.count}</Text>
            </View>
        );
    }

    /**
     * Fetches items in todoist using the latest sync token stored in the state,
     * and after fetching, it updates the sync token on the state.
     */
    handleFetch = () => {
        // Convert body into x-www-form-urlencoded
        const body = Object
            .entries(Object.assign({ sync_token: this.state.sync }, Request.body))
            .reduce((acc, [k, v]) => acc.concat(`${k}=${encodeURIComponent(v)}`), [])
            .join('&');
        fetch(Config.endpoint, { ...Request, body })
            .then(response => response.json())
            .then(({ sync_token: sync, items }) => {
                this.setState(prevState => ({
                    sync,
                    items: prevState.items.concat(items),
                }));
            });
    }
}

