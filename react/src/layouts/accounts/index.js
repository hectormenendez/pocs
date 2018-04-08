import React from 'react';
import { Layout, Input, InputNumber, Select } from 'antd';

import GoogleAPI from '~/utils/gapi';
import Formatters from '~/utils/formatters';
import Parsers from '~/utils/parsers';

import { Content as StyleContent } from '~/layouts/index.module.css';
import Style from './index.module.css';

const State = {
    types: null,
};

export default class ComponentAccounts extends React.Component {

    state = State;

    componentDidMount() {
        // Fetch the types from the spreadsheet
        GoogleAPI()
            .then(gapi => gapi.shorthands.run({ func: 'getTypes' }))
            .then(response => this.setState({ types: response }));
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
