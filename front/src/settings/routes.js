import Home from '~/pages/home';
import Accounts from '~/pages/accounts';
import Test from '~/pages/test';

export default [
    {
        path: '/',
        title: 'Home',
        exact: true,
        icon: 'home',
        component: Home,
    },
    {
        path: '/accounts',
        title: 'Accounts',
        icon: 'idcard',
        component: Accounts,
    },
    {
        path: '/test',
        title: 'Test',
        icon: 'idcard',
        component: Test,
    },
];
