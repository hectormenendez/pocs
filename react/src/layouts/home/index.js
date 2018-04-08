import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Link as RouterLink } from 'react-router-dom';

import { Content as StyleContent } from '~/layouts/index.module.scss';
import { Breadcrumb as StyleBreadcrumb } from './index.module.css';

export default () => <Layout.Content className={StyleContent}>
    <Breadcrumb className={StyleBreadcrumb}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Tempo</Breadcrumb.Item>
    </Breadcrumb>
    <section>
        <RouterLink to="/accounts">Accounts</RouterLink>
    </section>
</Layout.Content>;
