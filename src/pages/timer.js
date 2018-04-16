import React from 'react';
import Markdown from 'react-native-simple-markdown';
import PropTypes from 'prop-types';
import { connect as Connect } from 'react-redux';
import { SafeAreaView, StyleSheet } from 'react-native';
import { View, Button, Text } from 'antd-mobile';

import { MilliToHuman } from '~/utils/time';
import { Types as TypesSelected, Actions as ActionsSelected } from '~/stores/selected';
import { Actions as ActionsTodoist } from '~/stores/todoist';

export const Style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    element: {
        marginTop: 10,
        width: '70%',
    },
    doubleHeight: {
        marginTop: 40,
        marginBottom: 40,
    },
    time: {
        fontSize: 80,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Menlo',
    },
    timeDue: {
        color: '#e75053',
    },
    mdText: { fontSize: 18, lineHeight: 18 },
    mdLink: { textDecorationLine: 'underline' },
});

export const State = {
    time: 0,
    text: '00:00',
    interval: null,
    direction: -1,
};

export class Component extends React.Component {

    static name = 'Pages.Timer';

    static propTypes = {
        selected: TypesSelected,
        dispatch: PropTypes.func.isRequired,
    };

    state = State;

    componentDidMount() {
        this.setState({
            time: this.props.selected.time,
            text: MilliToHuman(this.props.selected.time),
            interval: setInterval(this.onInterval, 1000),
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    render () {
        const timeStyle = [Style.time]
            .concat(this.state.direction === 1 ? Style.timeDue : []);
        return <SafeAreaView style={Style.container}>
            <View style={Style.element}>
                <Markdown
                    whitelist={['link', 'strong']}
                    styles={{ link: Style.mdLink, text: Style.mdText }}>
                    {this.props.selected.item.content}
                </Markdown>
            </View>
            <View style={[Style.element, Style.doubleHeight]}>
                <Text style={timeStyle}>{this.state.text}</Text>
            </View>
            <View style={Style.element}>
                <Button type="primary" onClick={this.onDone}>Done</Button>
            </View>
            <View style={Style.element}>
                <Button onClick={this.onPause}>
                    {this.state.interval ? 'Pause' : 'Resume' }
                </Button>
            </View>
            <View style={Style.element}>
                <Button type="warning" onClick={this.onCancel}>Cancel</Button>
            </View>
        </SafeAreaView>;
    }

    onInterval = () => {
        const time = this.state.time + (1000 * this.state.direction);
        this.setState({
            time,
            text: MilliToHuman(time),
            direction: time !== 0 ? this.state.direction : this.state.direction * -1,
        });
    }

    onPause = () => this.state.interval
        ? this.setState({ interval: clearInterval(this.state.interval) })
        : this.setState({ interval: setInterval(this.onInterval, 1000) });

    onCancel = () => this.props.dispatch(ActionsSelected.reset());

    onDone = () => this.props
        .dispatch(ActionsTodoist.itemComplete({
            item: this.props.selected.item,
            time: {
                orig: this.props.selected.time,
                curr: this.state.time,
            },
            expired: this.state.direction !== -1,
        }))
        .then(() => this.onCancel());
}

export default Connect(
    store => ({ selected: store.selected }),
)(Component);
