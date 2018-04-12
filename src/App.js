import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

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
        // TODO: Move initial fetch to here.
    }

    render() {
        return (
            <View style={styles.container}>
                <Button
                    title="Fetch"
                    onPress={this.handleFetch} />
                <Text style={styles.text}>{this.state.count}</Text>
            </View>
        );
    }

    handleFetch = () => {
        // Convert body into x-www-form-urlencoded
        const body = Object
            .entries(Object.assign({ sync_token: this.state.sync }, Request.body))
            .reduce((acc, [k, v]) => acc.concat(`${k}=${encodeURIComponent(v)}`), [])
            .join('&');
        fetch(Config.endpoint, { ...Request, body })
            .then(response => response.json())
            .then(({ sync_token: sync, items }) => {
                this.setState({ sync, items: items.concat[items] });
                console.log(this.state);
            });
    }
}

