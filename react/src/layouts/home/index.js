import React from 'react';
import { Layout } from 'antd';
import { Link as RouterLink } from 'react-router-dom';

import { Consumer } from '~/data';
import Breadcrumbs from '~/components/breadcrumbs';
import { Content as StyleContent } from '~/layouts/index.module.scss';

export default () => <Layout.Content className={StyleContent}>

    <Breadcrumbs />

    <section>
        <RouterLink to="/transfers">Transfers</RouterLink>
        <RouterLink to="/accounts">Accounts</RouterLink>
    </section>

    <Consumer>
        {context => <div>
            {context.state.test}
        </div>}
    </Consumer>

</Layout.Content>;
