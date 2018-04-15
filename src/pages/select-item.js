import React from 'react';
import PropTypes from 'prop-types';
import { connect as Connect } from 'react-redux';
import { StyleSheet, SafeAreaView, AsyncStorage } from 'react-native';
import { SearchBar, List } from 'antd-mobile';
import Markdown from 'react-native-simple-markdown';

import Config from '~/utils/config.json';
import Todoist from '~/utils/todoist';
import ComponentLoading from '~/components/loading';
import { Actions as ActionsTodoist, Types as TypesTodoist } from '~/states/todoist';
import { Actions as ActionsSelected, Types as TypesSelected} from '~/states/selected';

export const Style = StyleSheet.create({
    container: { backgroundColor: '#efeff4' },
});

export const State = {
    text: '',
    results: [],
};

export class Component extends React.Component {

    state = State;

    componentDidMount() {
        // AsyncStorage.removeItem(Config.storeKey);
        // debugger;
        AsyncStorage
            .getItem(Config.storeKey)
            // if we have a stored value, populate the global state
            // but still ask for new items on todoist to update the sate.
            .then((storedValue) => {
                let syncID = '*';
                if (storedValue !== null) {
                    const todoist = JSON.parse(storedValue);
                    syncID = todoist.sync;
                    this.props.doAdd(todoist);
                }
                return Todoist(syncID);
            })
            // Store the fetched dat in the global state.
            .then(data => this.props.doAdd(data))
            // Save the results of the operation to the storage.
            .then(() => {
                const { todoist } = this.props;
                return AsyncStorage.setItem(Config.storeKey, JSON.stringify(todoist));
            })
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
        this.props.doSelect(this.state.results[index]);
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

Component.name = 'Page.Select';

Component.propTypes = {
    todoist: TypesTodoist,
    selected: TypesSelected,
    doAdd: PropTypes.func.isRequired,
    doSelect: PropTypes.func.isRequired,
};


// Connect and expose the managed state and the dispatchers this component will use.
export default Connect(
    state => ({
        todoist: state.todoist,
        selected: state.selected,
    }),
    dispatch => ({
        doAdd: payload => dispatch(ActionsTodoist.add(payload)),
        doSelect: payload => dispatch(ActionsSelected.setItem(payload)),
    }),
)(Component);
