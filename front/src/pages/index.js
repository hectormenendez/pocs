import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Row, Col, Button } from 'antd';
import { Connect } from '@gik/redux-factory';
import { withRouter as Routed } from 'react-router-dom';

import Breadcrumb from '~/components/breadcrumb';
import { Routes } from '~/components/route';
import { Types as TypesRoutes } from '~/stores/routes';
import { Types as TypesGoogle, Actions as ActionsGoogle } from '~/stores/google';

import Styles from './index.module.scss';

export class Component extends React.Component {

    static propTypes = {
        routes: TypesRoutes,
        dispatch: PropTypes.func.isRequired,
        isAuthed: TypesGoogle.isSignedIn,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }),
    };

    render() {
        const { location, routes, isAuthed } = this.props;
        return <Layout>
            <Layout.Header>
                <Row>
                    <Col span={12} className={Styles.HeaderLeft}>
                        <h1>PoC</h1>
                    </Col>
                    <Col span={12} className={Styles.HeaderRight}>
                        {isAuthed && <Button onClick={this.onLogout}>Logout</Button>}
                    </Col>
                </Row>
            </Layout.Header>

            <Layout.Content className={Styles.Content}>
                {!isAuthed
                    ? <Button onClick={this.onLogin}>Login</Button>
                    : <React.Fragment>
                        <Breadcrumb routes={routes} pathname={location.pathname} />
                        <Routes routes={routes} />
                    </React.Fragment>
                }
            </Layout.Content>
            <Layout.Footer>
                <Row>
                    <Col span={24}><h2>Footer</h2></Col>
                </Row>
            </Layout.Footer>

        </Layout>;
    }

    onLogout = () => this.props.dispatch(ActionsGoogle.logout())
    onLogin = () => this.props.dispatch(ActionsGoogle.login())
}

export default Routed(Connect(
    (store, props) => ({
        isAuthed: store.google.isSignedIn,
        routes: store.routes,
        location: props.location, // not really needed, but added for clarity
    }),
)(Component));
