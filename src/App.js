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

export default class App extends React.Component {

    state = {
        token: Config.token,
        sync_token: '*',
        resource_types: JSON.stringify(['items']),
    };

    componentDidMount() {

        // A proper x-www-form-urlencoded paylod has to be created.
        const body = [
            `token=${this.state.token}`,
            `sync_token=${this.state.sync_token}`,
            `resource_types=${encodeURIComponent(this.state.resource_types)}`,
        ].join('&');

        fetch('https://todoist.com/api/v7/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body,
        })
        .then(response => response.json())
        .then(json => console.log(json));
    }

    render() {
        return (
            <View style={styles.container}>
                <Button
                    title="Count"
                    onPress={() => this.setState({ count: this.state.count + 1 })} />
                <Text style={styles.text}>{this.state.count}</Text>
            </View>
        );
    }
}

