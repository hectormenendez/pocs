import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { Connect } from '@gik/redux-factory';
import {
    Row,
    Col,
    Button,
    Form,
    Alert,
    Input,
    InputNumber,
    DatePicker,
    TimePicker,
    Select,
} from 'antd';

import ComponentLoader from '~/components/loader';
import { Actions as ActionsGoogle } from '~/stores/google';
// import { Component as FormExample } from '~/components/antd-form-example';

import Style from './index.module.scss';

const State = {
    config: {
        loaded: null,
    },
    response: {
        from: null,
        to: null,
        description: null,
        success: null,
    },
};

const ComponentSelect = ({ onChange, list, placeholder, decorator }) => {
    const select = <Select placeholder={placeholder} onChange={onChange}>
        {list.map(({ id, name }) =>
            <Select.Option value={id} key={id}>{name}</Select.Option>,
        )}
    </Select>;
    return <Form.Item>
        {decorator ? decorator(select) : select}
    </Form.Item>;
};

ComponentSelect.propTypes = {
    list: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    decorator: PropTypes.func,
};

export class Component extends React.Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    static defaultProps = {
        formatTime: 'HH:mm',
        formatDate: 'YY/MM/DD',
    };

    state = State;

    componentDidMount() {
        this.props
            .dispatch(ActionsGoogle.run({ method: 'get', params: ['state'] }))
            .then(config => config && this.setState({
                config: { ...config, loaded: true },
            }));
    }

    render() {

        console.log('config', this.state.config);
        console.log('response', this.state.response);

        if (!this.state.config.loaded) return <ComponentLoader />;

        const { getFieldDecorator: decorator } = this.props.form;
        const {
            response: {
                from: rFrom,
                to: rTo,
                description: rDesc,
                sucess: rSuccess,
            },
            config: {
                loaded: cLoaded,
                owners: cOwners,
                accounts: cAccounts,
                currencies: cCurrencies,
                transactions: {
                    envelopes: cEnvelopes,
                    categories: cCategories,
                }
            },
        } = this.state;


        return <React.Fragment>
            { this.state.success &&
                <Alert
                    type="success"
                    showIcon={true}
                    message="test"
                    closable={true}
                    style={{ marginBottom: '1em' }}
                />
            }
            <Form onSubmit={this.onSubmit} >

                <fieldset>
                    <label>From</label>
                    <ComponentSelect
                        placeholder="Owner"
                        list={cOwners.list}
                        onChange={this.onFromOwner}
                    />
                    { rFrom && rFrom.owner &&
                        <ComponentSelect
                            placeholder="Account"
                            list={cAccounts.list.filter(({ owner }) => owner === rFrom.owner)}
                            onChange={this.onFromAccount}
                        />
                    }
                </fieldset>

                { rFrom && rFrom.ready && <fieldset>
                    <label>To</label>
                    <ComponentSelect
                        placeholder="Owner"
                        list={cOwners.list}
                        onChange={this.onToOwner}
                    />
                    { rTo && rTo.owner &&
                        <ComponentSelect
                            placeholder="Account"
                            list={cAccounts.list.filter(({ owner }) => owner === rTo.owner)}
                            onChange={this.onToAccount}
                        />
                    }
                </fieldset> }

                { rFrom && rFrom.ready && rTo && rTo.ready && <React.Fragment>
                    <fieldset>
                        <label>Description</label>
                        <ComponentSelect
                            placeholder="Categories"
                            list={cCategories}
                            decorator={decorator('category', {
                                rules: [
                                    { required: true, message: 'Required' },
                                ],
                            })}
                        />
                        <ComponentSelect
                            placeholder="Envelopes"
                            list={cEnvelopes}
                            decorator={decorator('envelope', {
                                rules: [
                                    { required: true, message: 'Required' },
                                ],
                            })}
                        />
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
                                <ComponentSelect
                                    list={cCurrencies.list}
                                    decorator={decorator('currency', {
                                        initialValue: 'MXN',
                                        rules: [
                                            { required: true, message: 'Required' },
                                        ],
                                    })}
                                />
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
                                        format={this.props.formatDate}
                                        defaultValue={
                                            Moment('17/05/01', this.props.formatDate)
                                        }/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item>
                                    <TimePicker
                                        className={Style.fullWidth}
                                        format={this.props.formatTime}
                                        defaultValue={
                                            Moment('12:08', this.props.formatTime)
                                        }/>
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

                </React.Fragment> }
            </Form>
        </React.Fragment>;
    }

    onFromOwner = owner => this.setState({
        response: {
            from: { owner },
        },
    });

    onFromAccount = account => this.setState({
        response: {
            from: {
                account,
                owner: this.state.response.from.owner,
                ready: true,
            },
        },
    });

    onToOwner = owner => this.setState({
        response: {
            from: this.state.response.from,
            to: { owner },
        },
    });

    onToAccount = account => this.setState({
        response: {
            from: this.state.response.from,
            to: {
                account,
                owner: this.state.response.to.owner,
                ready: true,
            },
        },
    });

    onNumberFormat = value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    onNumberParse = value => value.replace(/\$\s?|(,*)/g, '');

    onSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log('onSubmit', err, values);
        })
        return false;
    }
}

export const FormHandledComponent = Form.create({

    mapPropstoFields(props) {
        console.log('mapPropstoFields', props);
        return {};
    },

    onFieldsChange(props, fields) {
        console.log('onFieldsChange', props, fields);
        return null;
    },

})(Component);

export default Connect()(FormHandledComponent);

