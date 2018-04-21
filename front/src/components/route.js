import React from 'react';
import PropTypes from 'prop-types';
import { Route as ReactRoute } from 'react-router-dom';

export const Route = (props) => {
    const { path, exact, strict, routes, component: Target } = props;
    return <ReactRoute
        path={path}
        exact={exact}
        strict={strict}
        render={p => <Target {...p} routes={routes} />}
    />;
};

Route.propTypes = {
    path: PropTypes.string.isRequired,
    routes: PropTypes.array,
    component: PropTypes.func.isRequired,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
};

Object.defineProperty(Route, 'name', { value: 'ComponentRoute' });

export const Routes = ({ routes }) => routes
    .map((route, i) => <Route key={i} {...route} />);

export default Route;
