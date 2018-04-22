import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Input, InputNumber, Select } from 'antd';
import { Connect } from '@gik/redux-factory';

import Formatters from '~/utils/formatters';
import Parsers from '~/utils/parsers';
import { Actions as ActionsGoogle } from '~/stores/google';
import { Content as StyleContent } from '~/pages/index.module.scss';

import Style from './index.module.css';

const State = {
    types: null,
};

export class Component extends React.Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    }

    state = State;

    componentDidMount() {
        this.props
            .dispatch(ActionsGoogle.run({ method: 'getTypes' }))
            .then(types => types && this.setState({ types }));
    }

    render() {
        return <Layout.Content className={StyleContent}>
            <input type="hidden" name="date"/>
            <fieldset>
                <label>Unique Identfier</label>
                <Input/>
            </fieldset>

            <fieldset>
                <label>Name</label>
                <Input/>
            </fieldset>

            <fieldset >
                <label>Description</label>
                <Input/>
            </fieldset>

            <fieldset >
                <label>Owner</label>
                <Select
                    showSearch={true}
                    className={Style.SelectFull}
                    placeholder="Select an owner">
                    <Select.Option value="Test">Test</Select.Option>
                </Select>
            </fieldset>

            <fieldset >
                <label>Type</label>
                {!this.state.types
                    ? <Input disabled={true} placeholder="Loading…" />
                    : <Select
                        showSearch={true}
                        className={Style.SelectFull}
                        placeholder="Select a type">
                        {this.state.types.map(({ key, value }, i) =>
                            <Select.Option
                                key={`option-${i}`}
                                value={value}>
                                {key}
                            </Select.Option>,
                        )}
                    </Select>}
            </fieldset>

            <fieldset >
                <label>Initial Balance</label>
                <InputNumber
                    defaultValue={0}
                    formatter={Formatters.currency}
                    parser={Parsers.currency}
                />
                <Select
                    showSearch={true}
                    className={Style.SelectMin}
                    defaultValue="MXN">
                    <Select.Option value="MXN">MXN</Select.Option>
                </Select>
            </fieldset>
        </Layout.Content>;
    }

}

export default Connect()(Component);
