import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

const Titles = routes => routes.reduce((acc, { path, title, routes: nested }) => acc
    .concat(path && title ? { path, title } : [])
    .concat(Array.isArray(nested) ? Titles(nested) : [])
    .filter(Boolean),
[]);

export const Component = ({ routes, pathname }) => {

    const parts = pathname.split('/').filter(Boolean);
    const titles = Titles(routes)
        .reduce((acc, { path, title }) => ({ ...acc, [path]: title }), {});

    return <Breadcrumb>

        <Breadcrumb.Item>
            <Link to="/">{titles['/']}</Link>
        </Breadcrumb.Item>
        {parts.map((_, i) => {
            const key = `/${parts.slice(0, i + 1).join('/')}`;
            return <Breadcrumb.Item key={key}>
                <Link to={key}>{titles[key]}</Link>
            </Breadcrumb.Item>;
        })}

    </Breadcrumb>;
};

Component.propTypes = {
    routes: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired,
};

Object.defineProperty(Component, 'name', { value: 'ComponentBreadcrumb' });

export default Component;
