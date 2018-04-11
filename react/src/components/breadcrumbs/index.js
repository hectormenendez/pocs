import React from 'react';
import { Breadcrumb } from 'antd';
import { Link as RouterLink } from 'react-router-dom';

import Style from './index.module.scss';

export default () => <Breadcrumb className={Style.Breadcrumb}>
    <Breadcrumb.Item>
        <RouterLink to="/">Home</RouterLink>
    </Breadcrumb.Item>
</Breadcrumb>;
