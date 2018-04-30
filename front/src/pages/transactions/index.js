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
} from 'antd';

import ComponentLoader from '~/components/loader';
import { Actions as ActionsGoogle } from '~/stores/google';

import Style from './index.module.scss';
import { Component as ComponentSelect } from './select';

const State = {
    config: {
        loaded: null,
    },
    response: {
        from: null,
        to: null,
    },
    success: null,
};

export class Component extends React.Component {

    static propTypes = {
        ...Form.propTypes,
        dispatch: PropTypes.func.isRequired,
        formatTime: PropTypes.string.isRequired,
        formatDate: PropTypes.string.isRequired,
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
        if (!this.state.config.loaded) return <ComponentLoader />;

        const moment = Moment();
        const required = { rules: [{ required: true, message: 'Required' }] };

        const {
            formatDate,
            formatTime,
            form: {
                getFieldDecorator: decorator,
            },
        } = this.props;

        const {
            response: {
                from: rFrom,
                to: rTo,
            },
            config: {
                settings: cSettings,
                owners: cOwners,
                accounts: cAccounts,
                currencies: cCurrencies,
                transactions: {
                    envelopes: cEnvelopes,
                    categories: cCategories,
                },
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
                            decorator={decorator('category', required)}
                        />
                        <ComponentSelect
                            placeholder="Envelopes"
                            list={cEnvelopes}
                            decorator={decorator('envelope', required)}
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
                                    useIds={true}
                                    list={cCurrencies.list}
                                    decorator={decorator('currency', {
                                        ...required,
                                        initialValue: cSettings.currency,
                                    })}
                                />
                            </Col>
                            <Col span={16}>
                                <Form.Item>
                                    {
                                        decorator('amount', required)(
                                            <InputNumber
                                                step={0.1}
                                                precision={2}
                                                formatter={this.onNumberFormat}
                                                parser={this.onNumberParse}
                                                className={Style.fullWidth}
                                            />,
                                        )
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item>
                                    {
                                        decorator('date', {
                                            ...required,
                                            initialValue: moment,
                                        })(
                                            <DatePicker
                                                className={Style.fullWidth}
                                                format={formatDate} />,
                                        )
                                    }
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item>
                                    {
                                        decorator('time', {
                                            ...required,
                                            initialValue: moment,
                                        })(
                                            <TimePicker
                                                className={Style.fullWidth}
                                                format={formatTime} />,
                                        )
                                    }
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

    onCancel = () => this.setState({ ...State, config: this.state.config });

    onSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log('onSubmit', err, values);
        })
        return false;
    }

}

export const FormHandledComponent = Form.create()(Component);

export default Connect()(FormHandledComponent);

