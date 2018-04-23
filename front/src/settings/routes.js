import Home from '~/pages/home';
import Accounts from '~/pages/accounts';

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
];
