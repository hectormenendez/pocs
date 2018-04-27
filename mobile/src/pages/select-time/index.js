import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'antd-mobile';
import { connect as Connect } from 'react-redux';
import {
    View,
    SafeAreaView,
    Dimensions,
    Image,
    TouchableHighlight,
    Text,
    StyleSheet,
} from 'react-native';

import { Actions as ActionsSelected } from '~/stores/selected';
import { Gomodoro1, Gomodoro2, Gomodoro3, Gomodoro5, Gomodoro8 } from '~/media';

import StyleProps from './style';

export const Style = StyleSheet.create(StyleProps);
export const State = { orientation: null };

const Images = {
    1: Gomodoro1,
    2: Gomodoro2,
    3: Gomodoro3,
    5: Gomodoro5,
    8: Gomodoro8,
};

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
            style={Style.Container}
            onLayout={this.onLayout}>

            <Flex direction={this.state.orientation === 'landscape' ? 'column' : 'row' }>

                {[1, 2, 3, 5, 8].map((unit, i) =>
                    <Flex.Item key={i}>

                        <TouchableHighlight
                            style={Style.ContainerTouchable}
                            onPress={this.onClick.bind(this, unit)}>

                            <View style={Style.ContainerButton}>
                                <Image source={Images[unit]} style={Style.ButtonImage} />
                                <Text
                                    style={[Style[`ButtonText${unit}`], Style.ButtonText]}>
                                    {unit}
                                </Text>
                            </View>

                        </TouchableHighlight>

                    </Flex.Item>)}

            </Flex>
        </SafeAreaView>;
    }

    onClick = time => this.props.dispatch(ActionsSelected.setTime(time));

    onLayout = () => {
        const { width, height } = Dimensions.get('window');
        this.setState({
            orientation: height > width ? 'landscape' : 'portrait',
        });
    };
}

export default Connect()(Component);
