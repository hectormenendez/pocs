import React from 'react';
import PropTypes from 'prop-types';
import { Connect } from '@gik/redux-factory';

import { Actions as ActionsGoogle } from '~/stores/google';


const State = {};

export class Component extends React.Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    state = State;

    componentDidMount() {
        this.props
            .dispatch(ActionsGoogle.run({ method: 'get', params: ['state'] }))
            .then(response => response && this.setState({ response }));
    }

    render() {
        console.log(this.state.response);
        return <pre>
            {this.state.response && 'loaded'}
        </pre>;
    }
}

export default Connect()(Component);
