import React from 'react';
import Markdown from 'react-native-simple-markdown';
import PropTypes from 'prop-types';
import { connect as Connect } from 'react-redux';
import { AppState, SafeAreaView, StyleSheet } from 'react-native';
import { View, Button, Text, Flex, WhiteSpace } from 'antd-mobile';

import { MilliToHuman } from '~/utils/time';
import { Types as TypesSelected, Actions as ActionsSelected } from '~/stores/selected';
import { Actions as ActionsTodoist } from '~/stores/todoist';
import { Actions as ActionsGomodoro } from '~/stores/gomodoro';

import StyleProps from './style';

export const Style = StyleSheet.create(StyleProps);

export const State = {
    time: 0,
    text: '00:00',
    interval: null,
    direction: -1,
    prevAppState: AppState.currentState, // the application state (active / inactive)
    lastTime: null,
};

export class Component extends React.Component {

    static name = 'Pages.Timer';

    static propTypes = {
        selected: TypesSelected,
        dispatch: PropTypes.func.isRequired,
    };

    state = State;

    componentDidMount() {
        // initalize interval when component loads
        this.setState({
            time: this.props.selected.time,
            text: MilliToHuman(this.props.selected.time),
            interval: setInterval(this.onInterval, 1000),
        });
        // register a listener for application state changing
        AppState.addEventListener('change', this.onAppStateChange);
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
        AppState.removeEventListener('change', this.onAppStateChange);
    }

    render () {
        const timeStyle = [Style.time]
            .concat(this.state.direction === 1 ? Style.timeDue : []);

        return <SafeAreaView style={Style.container}>

            <Markdown
                whitelist={['link', 'strong']}
                styles={{ link: Style.mdLink, text: Style.mdText }}>
                {this.props.selected.item.content}
            </Markdown>

            <WhiteSpace/>

            <View style={Style.doubleHeight}>
                <Text style={timeStyle}>{this.state.text}</Text>
            </View>

            <WhiteSpace/>

            <Flex>
                <Flex.Item>
                    <Button style={Style.spaceRight} type="warning" onClick={this.onCancel}>
                        Cancel
                    </Button>
                </Flex.Item>
                <Flex.Item>
                    <Button
                        type="primary"
                        onClick={this.onAction.bind(this, 'itemComplete')}>
                        Done
                    </Button>
                </Flex.Item>
            </Flex>

            <WhiteSpace/>

            <Flex>
                <Flex.Item>
                    <Button style={Style.spaceRight} onClick={this.onPause}>
                        {this.state.interval ? 'Pause' : 'Resume' }
                    </Button>
                </Flex.Item>
                <Flex.Item>
                    <Button
                        type="ghost"
                        onClick={this.onAction.bind(this, 'itemUpdate')}>
                        Partial
                    </Button>
                </Flex.Item>
            </Flex>

        </SafeAreaView>;
    }

    onAppStateChange = (nextAppState) => {
        const { prevAppState } = this.state;
        if (prevAppState === 'background' && nextAppState === 'active') {
            // app retuned from inactivity, determine how much time did it spend away.
            const timeAway = new Date() - this.state.lastTime;
            if (this.state.direction === -1 && timeAway < this.props.selected.time) {
                // The time away is still within boundaries
                this.setState({
                    time: this.state.time - timeAway,
                });
            } else if (this.state.direction === -1) {
                // The time away exceeds the original estimated.
                this.setState({
                    time: timeAway - this.props.selected.time,
                    direction: 1,
                });
            } else {
                // the user already was past estimated time
                this.setState({ time: timeAway + this.state.time });
            }
        } else if (nextAppState === 'background') {
            // app is no longer active, save the date to later use it as reference.
            this.setState({ lastTime: new Date() });
        }
        // keep the app state updated
        this.setState({ prevAppState: nextAppState });
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

    onAction = (type) => {
        const time = this.state.direction === -1
            ? this.props.selected.time - this.state.time
            : this.props.selected.time + this.state.time;
        // Before executing itemComplete update the gomodoro equivalency.
        const initial$ = type !== 'itemComplete'
            ? Promise.resolve(type)
            : this.props
                .dispatch(ActionsGomodoro.set({
                    [this.props.selected.gomodoro]: time,
                }))
                .then(() => type);
        return initial$
            .then(t => this.props.dispatch(ActionsTodoist[t]({
                item: this.props.selected.item,
                time: {
                    orig: this.props.selected.time,
                    curr: this.state.time,
                },
                expired: this.state.direction !== -1,
            })))
            .then(() => this.onCancel());
    }

}

export default Connect(
    store => ({ selected: store.selected }),
)(Component);
