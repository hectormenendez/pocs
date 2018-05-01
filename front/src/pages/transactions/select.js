import React from 'react';
import PropTypes from 'prop-types';
import { Select, Form } from 'antd';


export class ComponentSelect extends React.Component {

    static defaultProps = {
        useIds: false,
        showSearch: false,
    };

    static propTypes = {
        list: PropTypes.array.isRequired,
        useIds: PropTypes.bool.isRequired,
        showSearch: PropTypes.bool.isRequired,
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
            showSearch,
        } = this.props;

        const common = { placeholder, onChange };

        if (showSearch) Object.assign(common, { // eslint-disable-line curly
            showSearch,
            optionFilterProp: 'children',
            filterOptions: (input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        });

        // The value property only can be used without decorator.
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
