import React from 'react';
import PropTypes from 'prop-types';
import { connect as Connect } from 'react-redux';
import { StyleSheet, SafeAreaView, AsyncStorage } from 'react-native';
import { SearchBar, List } from 'antd-mobile';
import Markdown from 'react-native-simple-markdown';

import Config from '~/utils/config.json';
import Todoist from '~/utils/todoist';
import ComponentLoading from '~/components/loading';
import { Actions as ActionsTodoist, Types as TypesTodoist } from '~/stores/todoist';
import { Actions as ActionsSelected, Types as TypesSelected } from '~/stores/selected';

export const Style = StyleSheet.create({
    container: { backgroundColor: '#efeff4' },
});

export const State = {
    text: '',
    results: [],
};

export class Component extends React.Component {

    static name = 'Page.SelectItem';

    static propTypes = {
        todoist: TypesTodoist,
        selected: TypesSelected,
        dispatch: PropTypes.func.isRequired, // Added by redux-thunk
    };

    state = State;

    componentDidMount() {
        AsyncStorage
            .getItem(Config.storeKey)
            // if we have a stored value, populate the global state using it
            // but ask for the difference since the last time we synced.
            .then((storedValue) => {
                let syncID = '*';
                if (storedValue) {
                    const todoist = JSON.parse(storedValue);
                    syncID = todoist.sync;
                    this.props.dispatch(ActionsTodoist.add(todoist));
                }
                return Todoist(syncID);
            })
            // Store the fetched dat in the global state.
            .then((data) => {
                this.props.dispatch(ActionsTodoist.add(data));
            })
            // Save the results of the operation to the storage.
            .then(() => AsyncStorage.setItem(
                Config.storeKey,
                JSON.stringify(this.props.todoist),
            ))
            .catch((err) => { throw err; });
    }

    render () {
        return !this.props.todoist.items.length
            ? <ComponentLoading />
            : <SafeAreaView style={Style.container}>
                <SearchBar
                    value={this.state.text}
                    placeholder="Tasks"
                    maxLength={20}
                    onChange={this.onSearch.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                />
                <List>
                    {this.state.results.map((result, i) =>
                        <List.Item
                            key={i}
                            onClick={this.onSelect.bind(this, i)}>
                            <Markdown>{result.content}</Markdown>
                        </List.Item>)
                    }
                </List>
            </SafeAreaView>;
    }

    onSelect = (index) => {
        this.props.dispatch(ActionsSelected.setItem(this.state.results[index]));
        this.onCancel();
    }

    onSearch = (text) => {
        const { items } = this.props.todoist;
        if (text.length === 0) return this.onCancel();
        const results = items
            .filter(item => item.content.toLowerCase().indexOf(text.toLowerCase()) !== -1)
            .slice(0, 15);
        return this.setState({ text, results });
    }

    onCancel = () => this.setState(State);

}

// Connect and expose the store parts needed
export default Connect(
    store => ({
        todoist: store.todoist,
        selected: store.selected,
    }),
)(Component);
