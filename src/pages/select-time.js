import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { Button, Flex } from 'antd-mobile';
import { connect as Connect } from 'react-redux';

import { Actions as ActionsSelected } from '~/stores/selected';

export const Style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 40,
        marginRight: 40,
    },
    button: {
        marginTop: 20,
        width: 120,
        height: 80,
    },
    button0: {
        backgroundColor: '#ffffcc',
        borderColor: '#eeeebb',
    },
    button1: {
        backgroundColor: '#ffe787',
        borderColor: '#eed676',
    },
    button2: {
        backgroundColor: '#ffb443',
        borderColor: '#eea332',
    },
    button3: {
        backgroundColor: '#ff6600',
        borderColor: '#ee5500',
    },
    button4: {
        backgroundColor: '#ff3300',
        borderColor: '#ee2200',
    },
});

const State = { orientation: null };

export class Component extends React.Component {

    static name = 'Page.SelectTime';
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    state = State;

    componentDidMount() {
        this.onLayout();
    }

    render() {
        return <SafeAreaView
            style={Style.container}
            onLayout={this.onLayout}>

            <Flex direction={this.state.orientation === 'landscape' ? 'column' : 'row' }>
                {[10, 25, 50, 75, 90].map((time, i) => <Flex.Item key={i}>
                    <Button
                        style={[Style.button, Style[`button${i}`]]}
                        onClick={this.onClick.bind(this, time)}>
                        {time}min
                    </Button>
                </Flex.Item>)}
            </Flex>
        </SafeAreaView>;
    }

    onClick = time => this.props.dispatch(ActionsSelected.setTime(time * 60 * 1000));

    onLayout = () => {
        const { width, height } = Dimensions.get('window');
        this.setState({
            orientation: height > width ? 'landscape' : 'portrait',
        });
    };
}


export default Connect()(Component);
