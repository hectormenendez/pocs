import React from 'react';
import { Link } from 'react-router-dom';
import { Connect } from '@gik/redux-factory';

export const Component = () => <React.Fragment>
    <Link to="/accounts">Accounts</Link>
</React.Fragment>;

export default Connect()(Component);
