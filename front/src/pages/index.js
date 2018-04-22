import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Row, Col, Button, Alert } from 'antd';
import { Connect } from '@gik/redux-factory';
import { withRouter as Routed } from 'react-router-dom';

import ComponentBreadcrumb from '~/components/breadcrumb';
import { Routes } from '~/components/route';
import { Types as TypesRoutes } from '~/stores/routes';
import { Types as TypesError } from '~/stores/error';
import { Types as TypesGoogle, Actions as ActionsGoogle } from '~/stores/google';

import Styles from './index.module.scss';

export class Component extends React.Component {

    static propTypes = {
        error: TypesError,
        routes: TypesRoutes,
        dispatch: PropTypes.func.isRequired,
        isSignedIn: TypesGoogle.isSignedIn,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }),
    };

    render() {

        const { error, location, routes, isSignedIn } = this.props;

        return <Layout>

            <Layout.Header>
                <Row>
                    <Col span={12} className={Styles.HeaderLeft}>
                        <h1>PoC</h1>
                    </Col>
                    <Col span={12} className={Styles.HeaderRight}>
                        {isSignedIn && <Button onClick={this.onLogout}>Logout</Button>}
                    </Col>
                </Row>
            </Layout.Header>


            <Layout.Content className={Styles.Content}>

                <ComponentBreadcrumb routes={routes} pathname={location.pathname} />

                { error &&
                    <Alert type="error" message={error.name} description={error.message} />
                }
                { !error && !isSignedIn &&
                    <Button onClick={this.onLogin}>Login</Button>
                }
                { !error && isSignedIn &&
                    <Routes routes={routes} />
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
        error: store.error,
        isSignedIn: store.google.isSignedIn,
        routes: store.routes,
        location: props.location, // not really needed, but added for clarity
    }),
)(Component));


                    // { error && <ComponentError /> }

                    // { (!google.ready || !routes.length) && <ComponentLoader /> }

                    // { !error && google.ready && routes.length &&
                    //     <ReduxRouter history={history}>
                    //         <Pages />
                    //     </ReduxRouter>
                    // }
