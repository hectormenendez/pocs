import React from 'react';
import { connect as Connect } from 'react-redux';

import PageSelectItem from '~/pages/select-item';
import PageSelectTime from '~/pages/select-time';
import { Types as TypesSelected } from '~/states/selected';

export const Component = ({ selected }) => {

    const { item, time } = selected;

    return <React.Fragment>
        {!time && !item && <PageSelectItem/>}
        {!time && item && <PageSelectTime/>}
    </React.Fragment>;
};

Component.propTypes = {
    selected: TypesSelected,
};

export default Connect(
    state => ({ selected: state.selected }), // State in props
)(Component);
