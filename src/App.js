import React from 'react';
import Markdown from 'react-native-simple-markdown';
import EnUS from 'antd-mobile/lib/locale-provider/en_US';
import { AsyncStorage, SafeAreaView, StyleSheet} from 'react-native';
import { SearchBar, LocaleProvider, List, View, Text, Button } from 'antd-mobile';

import Config from './config.json';
import Todoist from './util/todoist';

const Styles = StyleSheet.create({
    container: { padding: 10, margin: 10 },
    mdText: { fontSize: 18, lineHeight: 18 },
    mdLink: { textDecorationLine: 'underline' },
    time: {
        fontSize: 80,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Menlo',
    },
});

const State = {
    sync: null,
    items: null,
    selected: null,
    timer: {
        ms: 10 * 1000,
        text: '00:10',
    },
    search: {
        text: '',
        results: [],
    },
};

let Interval;

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

    componentWillUnmount() {
        clearInterval(Interval);
    }

    componentDidUpdate() {
        if (this.state.timer.ms <= 0) {
            clearInterval(Interval);
            this.setState({ selected: State.selected, timer: State.timer });
        }
    }

    render() {
        // TODO: Add a proper loader.
        if (this.state.sync === null) return <SafeAreaView />;

        return <LocaleProvider locale={EnUS}>
            {this.state.selected === null
                ? <SafeAreaView>
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
                                <Markdown>{item.content}</Markdown>
                            </List.Item>)
                        }
                    </List>
                </SafeAreaView>
                : <SafeAreaView>
                    <View style={Styles.container}>
                        <Markdown
                            whitelist={['link', 'strong']}
                            styles={{ link: Styles.mdLink, text: Styles.mdText }}>
                            {this.state.selected.content}
                        </Markdown>
                    </View>
                    <View style={Styles.container}>
                        <Text style={Styles.time}>{this.state.timer.text}</Text>
                    </View>
                    <View style={Styles.container}>
                        <Button type="primary">Done</Button>
                    </View>
                    <View style={Styles.container}>
                        <Button type="warning">Pause</Button>
                    </View>
                </SafeAreaView>
            }
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
        Interval = setInterval(() => {
            const timer = this.state.timer.ms - 1000;
            const min = Math.floor(timer / 60000).toString().padStart(2, '0');
            const sec = ((timer % 60000) / 1000).toString().padStart(2, '0');
            this.setState({ timer: { ms: timer, text: `${min}:${sec}` } });
        }, 1000);
    }

}

