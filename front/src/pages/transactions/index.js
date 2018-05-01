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
import ComponentSelect from './select';

const State = {
    loaded: null,
    config: null,
    success: null,
    response: {
        // set to undefined so the input would show the placeholder, but can also be set
        // to null to reset the current selection.
        from: undefined,
        to: null,
    },
};

// TODO: Load new settings after each add and cancel?

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
            .then(config => config && this.setState({ loaded: true, config }));
    }

    render() {

        if (!this.state.loaded) return <ComponentLoader />;

        const moment = Moment();
        const required = { rules: [{ required: true, message: 'Required' }] };

        const {
            formatDate,
            formatTime,
            form: { getFieldDecorator: decorator },
        } = this.props;

        const {
            success,
            response: { from, to },
            config: {
                settings, owners, accounts, currencies,
                transactions: { envelopes, categories },
            },
        } = this.state;

        return <React.Fragment>
            { success &&
                <Alert
                    className={Style.Alert}
                    type="success"
                    message="test"
                    showIcon={true}
                    closable={true}
                />
            }

            <Form onSubmit={this.onSubmit} >
                <fieldset>
                    <label>From</label>
                    <ComponentSelect
                        placeholder="Owner"
                        list={owners.list}
                        value={!from ? from : from.owner}
                        onChange={this.onFromOwner}
                    />
                    { from && from.owner &&
                        <ComponentSelect
                            placeholder="Account"
                            list={
                                accounts.list.filter(({ owner }) => owner === from.owner)
                            }
                            onChange={this.onFromAccount}
                        />
                    }
                </fieldset>

                { from && from.ready &&
                    <fieldset>
                        <label>To</label>
                        <ComponentSelect
                            placeholder="Owner"
                            list={owners.list}
                            onChange={this.onToOwner}
                        />
                        { to && to.owner &&
                            <ComponentSelect
                                placeholder="Account"
                                list={
                                    accounts.list.filter(({ owner }) => owner === to.owner)
                                }
                                onChange={this.onToAccount}
                            />
                        }
                    </fieldset> }

                { from && from.ready && to && to.ready && <React.Fragment>
                    <fieldset>
                        <label>Description</label>
                        <ComponentSelect
                            placeholder="Categories"
                            list={categories}
                            decorator={decorator('category', required)}
                        />
                        <ComponentSelect
                            placeholder="Envelopes"
                            list={envelopes}
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
                                    list={currencies.list}
                                    decorator={decorator('currency', {
                                        ...required,
                                        initialValue: settings.currency,
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

                    <Row gutter={8} className={Style.ContainerButtons}>
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

    onCancel = () => this.setState({
        loaded: true,
        config: this.state.config,
        response: { from: null },
    });

    onSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((function callback(err, values) {
            if (err) return false;
            const { amount, category, currency, envelope } = values;
            const from = this.state.response.from.account;
            const to = this.state.response.to.account;
            const date = Moment(
                [
                    values.date.format(this.props.formatDate),
                    values.time.format(this.props.formatTime),
                ].join(' '),
                `${this.props.formatDate} ${this.props.formatTime}`,
            ).toDate().getTime();
            const payload = {
                amount, category, currency, envelope, from, to, date,
            };
            console.log(payload);
            return true;
        }).bind(this));
    }

}

export const FormHandledComponent = Form.create()(Component);

export default Connect()(FormHandledComponent);


