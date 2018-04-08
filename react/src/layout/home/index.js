import React from 'react';
import { Layout, Breadcrumb } from 'antd';

import { Content as StyleContent } from '~/layout/index.module.css';
import { Breadcrumb as StyleBreadcrumb } from './index.module.css';

export default () => <Layout.Content className={StyleContent}>
    <Breadcrumb className={StyleBreadcrumb}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Tempo</Breadcrumb.Item>
    </Breadcrumb>
    <section>Hello</section>
</Layout.Content>;
