import React from 'react';
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,
} from 'antd';

export class Component extends React.Component {

    static layout = {
        item: {
            labelCol: { xs: { span: 24 }, sm: { span: 8 } },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
        },
        tail: {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
            },
        },
    };

    static propTypes = {
        ...Form.propTypes,
    }

    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return <Form onSubmit={this.handleSubmit}>

            <Form.Item {...Component.layout.item} label="E-mail">
                {
                    getFieldDecorator('email', {
                        rules: [
                            { type: 'email', message: 'The input is not valid E-mail!' },
                            { required: true, message: 'Please input your E-mail!' },
                        ],
                    })(<Input/>)
                }
            </Form.Item>

            <Form.Item {...Component.layout.item} label="Password">
                {
                    getFieldDecorator('password', {
                        rules: [
                            { required: true, message: 'Please input your password!' },
                            { validator: this.validateToNextPassword },
                        ],
                    })(<Input type="password" />)
                }
            </Form.Item>

            <Form.Item {...Component.layout.item} label="Confirm Password">
                {
                    getFieldDecorator('confirm', {
                        rules: [
                            { required: true, message: 'Please confirm your password!' },
                            { validator: this.compareToFirstPassword },
                        ],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur}/>,
                    )
                }
            </Form.Item>

            <Form.Item
                {...Component.layout.item}
                label={(<span>
                    Nickname&nbsp;
                    <Tooltip title="What do you want others to call you?">
                        <Icon type="question-circle-o" />
                    </Tooltip>
                </span>)}>
                {
                    getFieldDecorator('nickname', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your nickname!',
                                whitespace: true,
                            },
                        ],
                    })(<Input />)
                }
            </Form.Item>

            <Form.Item {...Component.layout.item} label="Habitual Residence">
                {
                    getFieldDecorator('residence', {
                        initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                        rules: [
                            {
                                type: 'array',
                                required: true,
                                message: 'Please select your habitual residence!',
                            },
                        ],
                    })(<Cascader
                        options={[
                            {
                                value: 'zhejiang',
                                label: 'Zhejiang',
                                children: [{
                                    value: 'hangzhou',
                                    label: 'Hangzhou',
                                    children: [{
                                        value: 'xihu',
                                        label: 'West Lake',
                                    }],
                                }],
                            },
                            {
                                value: 'jiangsu',
                                label: 'Jiangsu',
                                children: [{
                                    value: 'nanjing',
                                    label: 'Nanjing',
                                    children: [{
                                        value: 'zhonghuamen',
                                        label: 'Zhong Hua Men',
                                    }],
                                }],
                            },
                        ]}/>)
                }
            </Form.Item>

            <Form.Item {...Component.layout.item} label="Phone Number">
                {
                    getFieldDecorator('phone', {
                        rules: [
                            { required: true, message: 'Please input your phone number!' },
                        ],
                    })(
                        <Input
                        style={{ width: '100%' }}
                        addonBefore={
                            getFieldDecorator('prefix', { initialValue: '86' })(
                                <Select style={{ width: 70 }}>
                                    <Select.Option value="86">+86</Select.Option>
                                    <Select.Option value="87">+87</Select.Option>
                                </Select>,
                            )
                        }
                    />)
                }
            </Form.Item>

            <Form.Item {...Component.layout.item} label="Website" >
                {
                    getFieldDecorator('website', {
                        rules: [
                            { required: true, message: 'Please input website!' },
                        ],
                    })(
                        <AutoComplete
                        placeholder="website"
                        onChange={this.handleWebsiteChange}
                        dataSource={
                            this.state.autoCompleteResult.map(website =>
                                <AutoComplete.Option key={website}>
                                    {website}
                                </AutoComplete.Option>,
                            )
                        }>
                        <Input />
                    </AutoComplete>)
                }
            </Form.Item>

            <Form.Item
                {...Component.layout.item}
                label="Captcha"
                extra="We must make sure that your are a human.">
                <Row gutter={8}>
                    <Col span={12}>
                        {
                            getFieldDecorator('captcha', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input the captcha you got!',
                                    },
                                ],
                            })(<Input />)
                        }
                    </Col>
                    <Col span={12}>
                        <Button>Get captcha</Button>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item {...Component.layout.tail}>
                {
                    getFieldDecorator('agreement', { valuePropName: 'checked' })(
                        <Checkbox>I have read the <a href="">agreement</a></Checkbox>,
                    )
                }
            </Form.Item>

            <Form.Item {...Component.layout.tail}>
                <Button type="primary" htmlType="submit">Register</Button>
            </Form.Item>

        </Form>;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) console.log('Received values of form: ', values);

        });
    }

    handleConfirmBlur = (e) => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password'))
            callback('Two passwords that you enter is inconsistent!');
        else callback();
    }

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty)
            form.validateFields(['confirm'], { force: true });
        callback();
    }

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) autoCompleteResult = [];
        else {
            autoCompleteResult = ['.com', '.org', '.net']
                .map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    }
}

export default Form.create()(Component);
