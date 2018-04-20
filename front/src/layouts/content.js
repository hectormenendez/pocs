import React from 'react';
import { Breadcrumb, Layout } from 'antd';
import { Link as RouteLink } from 'react-router-dom';

import Styles from './index.module.scss';

export default ({ routes, params, children }) => <section>
    { console.log(routes) }
    <Breadcrumb routes={routes} params={params} />
    {children || <Layout.Content className={Styles.Content}>
        <RouteLink to="/transfers">Transfers</RouteLink>
        <RouteLink to="/accounts">Accounts</RouteLink>
    </Layout.Content>}
</section>;
