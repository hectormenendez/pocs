import React from 'react';
import { Layout } from 'antd';
import { Route, Switch as RouterSwitch } from 'react-router-dom';

import Styles from './index.module.css';
import Home from './home';

export default () => <Layout>
    <Layout.Header className={Styles.Header}>
        <h1>PoC</h1>
    </Layout.Header>

    <RouterSwitch>
        <Route exact={ true } path="/" component={ Home } />
    </RouterSwitch>

    <Layout.Footer className={Styles.Footer}>
        Footer
    </Layout.Footer>
</Layout>;
