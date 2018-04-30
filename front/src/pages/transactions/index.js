import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { Connect } from '@gik/redux-factory';
import { Row, Col, Button, Form, Alert, Input, InputNumber, DatePicker, TimePicker, Select } from 'antd';

// import { Actions as ActionsGoogle } from '~/stores/google';
import Style from './index.module.scss';

const formatTime = 'HH:mm';
const formatDate = 'YY/MM/DD';
const State = {};

export class Component extends React.Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    state = State;

    componentDidMount() {
        // this.props
        //     .dispatch(ActionsGoogle.run({ method: 'get', params: ['state'] }))
        //     .then(response => response && this.setState({ response }));
    }

    render() {
        return <React.Fragment>
            <Alert
                type="success"
                showIcon={true}
                message="test"
                closable={true}
                style={{ marginBottom: '1em' }}
            />
            <Form onSubmit={this.onSubmit} >

                <fieldset>
                    <label>From</label>
                    <Form.Item>
                        <Select placeholder="Owner">
                            <Select.Option value="owner1">Owner1</Select.Option>
                            <Select.Option value="owner2">Owner2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Select placeholder="Account">
                            <Select.Option value="account1">Account1</Select.Option>
                            <Select.Option value="account2">Account2</Select.Option>
                        </Select>
                    </Form.Item>
                </fieldset>

                <fieldset>
                    <label>To</label>
                    <Form.Item>
                        <Select placeholder="Owner">
                            <Select.Option value="owner1">Owner1</Select.Option>
                            <Select.Option value="owner2">Owner2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Select placeholder="Account">
                            <Select.Option value="account1">Account1</Select.Option>
                            <Select.Option value="account2">Account2</Select.Option>
                        </Select>
                    </Form.Item>
                </fieldset>

                <fieldset>
                    <label>Description</label>
                    <Form.Item>
                        <Select placeholder="Category">
                            <Select.Option value="owner1">Category1</Select.Option>
                            <Select.Option value="owner2">Category2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Select placeholder="Envelope">
                            <Select.Option value="owner1">Envelope1</Select.Option>
                            <Select.Option value="owner2">Envelope2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Input.TextArea
                            autosize={{ minRows: 2, maxRows: 4 }}
                            autoComplete="off"
                            minLength={0}
                            maxLength={140}
                            placeholder="Note"
                            className={Style.TextArea}
                        />
                    </Form.Item>
                    <Row gutter={8}>
                        <Col span={8}>
                            <Form.Item>
                                <Select defaultValue="MXN">
                                    <Select.Option value="MXN">MXN</Select.Option>
                                    <Select.Option value="CAD">CAD</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item>
                                <InputNumber
                                    step={0.1}
                                    formatter={this.onNumberFormat}
                                    parser={this.onNumberParse}
                                    className={Style.fullWidth}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item>
                                <DatePicker
                                    className={Style.fullWidth}
                                    format={formatDate}
                                    defaultValue={Moment('17/05/01', formatDate)}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item>
                                <TimePicker
                                    className={Style.fullWidth}
                                    format={formatTime}
                                    defaultValue={Moment('12:08', formatTime)}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </fieldset>

                <Row gutter={8} style={{ marginTop: '1.5em' }}>
                    <Col span={8}>
                        <Button
                            className={Style.fullWidth}
                            type="danger"
                            onClick={this.onCancel}>
                            Cancel
                        </Button>
                    </Col>
                    <Col span={16}>
                        <Button
                            className={Style.fullWidth}
                            type="primary"
                            htmlType="submit">
                            Save
                        </Button>
                    </Col>
                </Row>

            </Form>
        </React.Fragment>;
    }

    onNumberFormat = value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    onNumberParse = value => value.replace(/\$\s?|(,*)/g, '');
}

export default Connect()(Component);

