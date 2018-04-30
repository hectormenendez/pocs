import React from 'react';
import PropTypes from 'prop-types';
import { Select, Form } from 'antd';

export const Component = (props) => {

    const {
        onChange,
        list,
        placeholder,
        decorator,
        useIds,
    } = props;

    const select = <Select placeholder={placeholder} onChange={onChange}>
        {list.map(({ id, name }) =>
            <Select.Option value={id} key={id}>
                {useIds ? id : name}
            </Select.Option>,
        )}
    </Select>;

    return <Form.Item>
        {decorator ? decorator(select) : select}
    </Form.Item>;
};

Component.defaultProps = {
    useIds: false,
};

Component.propTypes = {
    list: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    decorator: PropTypes.func,
    useIds: PropTypes.bool.isRequired,
};

export default Component;
