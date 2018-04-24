import React from 'react';
import { connect as Connect } from 'react-redux';

import { Types as TypesSelected } from '~/stores/selected';
import PageSelectItem from '~/pages/select-item';
import PageSelectTime from '~/pages/select-time';
import PageTimer from '~/pages/timer';

export const Component = ({ selected }) => {

    const { item, time } = selected;
    return <React.Fragment>
        {!time && !item && <PageSelectItem/>}
        {!time && item && <PageSelectTime/>}
        {time && item && <PageTimer/>}
    </React.Fragment>;
};

Component.propTypes = {
    selected: TypesSelected,
};

export default Connect(
    state => ({ selected: state.selected }), // State in props
)(Component);
