import React from 'react';
import { Spin } from 'antd';

import Style from './index.module.css';

export default () => <section className={Style.Loader}>
    <Spin size="large"/>
</section>;
