import Home from '~/pages/home';
import Accounts from '~/pages/accounts';

export default [
    {
        path: '/',
        title: 'Home',
        exact: true,
        component: Home,
    },
    {
        path: '/accounts',
        title: 'Accounts',
        component: Accounts,
    },
];
