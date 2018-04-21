import React from 'react';
import { Link } from 'react-router-dom';
import { Connect } from '@gik/redux-factory';

export const Component = () => <React.Fragment>
    <ul>
        <li><Link to="/accounts">Accounts</Link></li>
    </ul>
</React.Fragment>;

export default Connect()(Component);
