import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Alert, Button } from 'antd';
import { Connect } from '@gik/redux-factory';
import { withRouter as Routed } from 'react-router-dom';
import { push as GoTo } from 'react-router-redux';

import SettingsRoutes from '~/settings/routes';
import ComponentBreadcrumb from '~/components/breadcrumb';
import { Routes } from '~/components/route';
import { Types as TypesRoutes } from '~/stores/routes';
import { Types as TypesError } from '~/stores/error';
import { Types as TypesGoogle, Actions as ActionsGoogle } from '~/stores/google';

import Styles from './index.module.scss';

const State = {
    siderCollapsed: false,
};

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

    state = State;

    render() {

        const { error, location, routes, isSignedIn } = this.props;

        if (!isSignedIn) {
            return <section className={Styles.Login}>
                <Button type="primary" onClick={this.onLogin}> Login </Button>
            </section>;
        }

        return <Layout className={Styles.Container}>


            <Layout.Sider
                className={Styles.Sider}
                trigger={null}
                collapsible={true}
                collapsedWidth={0}
                breakpoint="md"
                collapsed={this.state.siderCollapsed}
                onCollapse={this.onSider}>

                <h1 className={Styles.Header}>MoneyManager</h1>

                <Menu
                    className={Styles.Menu}
                    theme="dark"
                    mode="inline"
                    onClick={this.onNav}
                    defaultSelectedKeys={[location.pathname]}>
                    {SettingsRoutes
                        .filter(route => route.path !== '/')
                        .map(route => <Menu.Item key={route.path}>
                            <Icon type={route.icon}/>
                            <span>{route.title}</span>
                        </Menu.Item>)
                    }
                </Menu>

            </Layout.Sider>

            <Layout className={Styles.Layout}>

                <Layout.Header className={Styles.Header}>
                    <Icon
                        type={this.state.siderCollapsed ? 'menu-unfold' : 'menu-fold' }
                        onClick={this.onSider.bind(this, !this.state.siderCollapsed)}
                    />

                    { isSignedIn && <Button
                        size="small"
                        shape="circle"
                        type="danger"
                        icon="logout"
                        onClick={this.onLogout} /> }

                    {/* figure out a way to show a flex here for the user */}
                </Layout.Header>

                <Layout.Content className={Styles.Content}>

                    <ComponentBreadcrumb
                        className={Styles.Breadcrumb}
                        routes={routes}
                        pathname={location.pathname} />

                    { error && <Alert
                        type="error"
                        message={error.name}
                        description={error.message} /> }

                    { !error && isSignedIn &&
                        <Routes routes={routes} /> }

                </Layout.Content>

                <Layout.Footer className={Styles.Footer}>
                    <small>Héctor Menéndez {new Date().getFullYear()}</small>
                </Layout.Footer>
            </Layout>

        </Layout>;
    }

    onLogout = () => this.props.dispatch(ActionsGoogle.logout());
    onLogin = () => this.props.dispatch(ActionsGoogle.login());
    onSider = siderCollapsed => this.setState({ siderCollapsed });
    onNav = ({ key }) => this.props.dispatch(GoTo(key));

}

export default Routed(Connect(
    (store, props) => ({
        error: store.error,
        isSignedIn: store.google.isSignedIn,
        routes: store.routes,
        location: props.location, // not really needed, but added for clarity
    }),
)(Component));
