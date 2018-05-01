import React from 'react';
import PropTypes from 'prop-types';
import { Select, Form } from 'antd';


export class ComponentSelect extends React.Component {

    static defaultProps = {
        useIds: false,
    };

    static propTypes = {
        list: PropTypes.array.isRequired,
        useIds: PropTypes.bool.isRequired,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        decorator: PropTypes.func,
        value: PropTypes.node,
    };

    render() {
        const {
            onChange,
            list,
            placeholder,
            decorator,
            useIds,
            value,
        } = this.props;

        // The value property only can be used without decorator.
        const common = { placeholder, onChange };
        const props = { ...common };
        if (!decorator && value !== undefined) props.value = value;

        const options = list.map(({ id, name }) => <Select.Option value={id} key={id}>
            {useIds ? id : name}
        </Select.Option>);


        return <Form.Item>
            { decorator
                ? decorator(
                    <Select {...common}>
                        {options}
                    </Select>,
                  )
                : <Select {...props}>
                    {options}
                  </Select>
            }
        </Form.Item>;
    }

}

export default ComponentSelect;
