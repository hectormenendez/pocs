import React from 'react';
import { Layout, Row, Col } from 'antd';
// import Logout from '~/components/logout';

import Styles from './index.module.scss';

export default () => <Layout.Header className={Styles.Header}>
    <Row>
        <Col span={12} className={Styles.HeaderLeft}>
            <h1>PoC</h1>
        </Col>
        <Col span={12} className={Styles.HeaderRight}>
            logout here
        </Col>
    </Row>
</Layout.Header>;

// TODO: this should be handled with the context API
// {this.state.isUserAuthenticated
//     && <Logout onClick={this.handleAuthLogout} /> }
