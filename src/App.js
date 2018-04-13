import React from 'react';
import { AsyncStorage, SafeAreaView } from 'react-native';
import { SearchBar, LocaleProvider, List } from 'antd-mobile';
import EnUS from 'antd-mobile/lib/locale-provider/en_US';
import Config from './config.json';
import Todoist from './util/todoist';

const State = {
    sync: null,
    items: null,
    selected: null,
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
            .then(data => this.setState(data))
            .catch(err => console.error(err));
    }

    render() {
        return <LocaleProvider locale={EnUS}>
            {this.state.sync === null
                ? <SafeAreaView />
                : <SafeAreaView>

                    <SearchBar
                        value={this.state.search.text}
                        placeholder="Tasks"
                        maxLength={20}
                        onChange={this.handleSearch.bind(this)}
                        onCancel={this.handleCancel.bind(this)}
                    />

                    <List>
                        {this.state.search.results.map((item, i) =>
                            <List.Item
                                key={i}
                                onClick={this.handleClick.bind(this, i)}>
                                {item.content}
                            </List.Item>)
                        }
                    </List>
                </SafeAreaView>}
        </LocaleProvider>;
    }

    handleSearch = (text) => {
        if (text.length === 0) return this.handleCancel();
        const results = this.state.items
            .filter(item => item.content.toLowerCase().indexOf(text.toLowerCase()) !== -1)
            .slice(0, 15);
        return this.setState({ search: { text, results } });
    }

    handleCancel = () => this.setState({ search: { text: '', results: [] } });

    handleClick = (index) => {
        this.setState({ selected: this.state.search.results[index] });
        this.handleCancel();
    }

}

