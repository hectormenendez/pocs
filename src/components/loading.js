import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'antd-mobile';

export const Style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export const Name = () => <View style={Style.container}>
    <ActivityIndicator size="large" />
</View>;

export default Name;
