import React from 'react';
import { Breadcrumb } from 'antd';
import { Link as RouterLink } from 'react-router-dom';

import { Consumer } from '~/data';
import Style from './index.module.scss';

export default () => <Breadcrumb className={Style.Breadcrumb}>
    <Consumer>
        {({ state }) => state.breadcrumbs
            .map((item, i) => <Breadcrumb.Item key={i}>
                <RouterLink to={item.href}>{item.title}</RouterLink>
            </Breadcrumb.Item>)}
    </Consumer>
</Breadcrumb>;
