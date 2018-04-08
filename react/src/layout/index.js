import React from 'react';
import { Layout, Breadcrumb } from 'antd';

import Styles from './index.module.css';

export default () => <Layout>
    <Layout.Header className={Styles.Header}>
        <h1>PoC</h1>
    </Layout.Header>
    <Layout.Content className={Styles.Content}>
        <Breadcrumb className={Styles.Breadcrumb}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Tempo</Breadcrumb.Item>
        </Breadcrumb>
        <section>Hello</section>
    </Layout.Content>
    <Layout.Footer className={Styles.Footer}>
        Footer
    </Layout.Footer>
</Layout>;
