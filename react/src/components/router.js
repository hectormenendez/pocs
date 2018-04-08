import React from 'react';
import { Route, Switch as RouterSwitch } from 'react-router-dom';

import Home from '~/layouts/home';
import Accounts from '~/layouts/accounts';

export default () => <RouterSwitch>
    <Route exact={true} path="/" component={Home} />
    <Route exact={true} path="/accounts" component={Accounts} />
</RouterSwitch>;
