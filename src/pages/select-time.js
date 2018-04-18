import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Button } from 'antd-mobile';
import { connect as Connect } from 'react-redux';

import { Actions as ActionsSelected } from '~/stores/selected';

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

export const Component = ({ dispatch }) => {
    const setTime = time => dispatch(ActionsSelected.setTime(time * 60 * 1000));
    return <SafeAreaView style={Style.container}>
        {[10, 25, 50, 75, 90].map((time, i) =>
            <Button
                key={i}
                style={[Style.button, Style[`button${i}`]]}
                onClick={setTime.bind(this, time)}>
                {time}min
            </Button>,
        )}
    </SafeAreaView>;
};

Component.name = 'Page.SelectTime';

Component.propTypes = { dispatch: PropTypes.func.isRequired };

export default Connect()(Component);
