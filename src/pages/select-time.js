import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Button } from 'antd-mobile';
import { connect as Connect } from 'react-redux';

import { Actions as ActionsSelected } from '~/states/selected';

export const Style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        width: 120,
        height: 80,
    },
    button1: {
        backgroundColor: '#ffffcc',
        borderColor: '#eeeebb',
    },
    button2: {
        backgroundColor: '#ffe787',
        borderColor: '#eed676',
    },
    button3: {
        backgroundColor: '#ffb443',
        borderColor: '#eea332',
    },
    button4: {
        backgroundColor: '#ff6600',
        borderColor: '#ee5500',
    },
});

export const Component = ({ dispatch }) => {
    const setTime = time => dispatch(ActionsSelected.setTime(time));
    return <SafeAreaView style={Style.container}>
        <Button
            style={[Style.button, Style.button1]}
            onClick={ setTime.bind(this, 25 * 60 * 1000) }>
            25min
        </Button>
        <Button
            style={[Style.button, Style.button2]}
            onClick={ setTime.bind(this, 50 * 60 * 1000) }>
            50min
        </Button>
        <Button
            style={[Style.button, Style.button3]}
            onClick={ setTime.bind(this, 75 * 60 * 1000) }>
            75min
        </Button>
        <Button
            style={[Style.button, Style.button4]}
            onClick={ setTime.bind(this, 90 * 60 * 1000) }>
            90min
        </Button>
    </SafeAreaView>;
};

Component.name = 'Page.SelectTime';

Component.propTypes = { dispatch: PropTypes.func.isRequired };

export default Connect()(Component);
