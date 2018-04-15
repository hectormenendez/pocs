import React from 'react';
import { connect as Connect } from 'react-redux';
import { Text } from 'react-native';

import PageSelectItem from '~/pages/select-item';
import PageSelectTime from '~/pages/select-time';
import { Types as TypesSelected } from '~/states/selected';

export const Component = ({ selected }) => {

    const { item, time } = selected;

    return <React.Fragment>
        {!time && !item && <PageSelectItem/>}
        {!time && item && <PageSelectTime/>}
        {time && item && <Text>Yaaaaaaas</Text>}
    </React.Fragment>;
};

Component.propTypes = {
    selected: TypesSelected,
};

export default Connect(
    state => ({ selected: state.selected }), // State in props
)(Component);
