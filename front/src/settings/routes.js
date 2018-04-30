import Home from '~/pages/home';
import Accounts from '~/pages/accounts';
import Transactions from '~/pages/transactions';

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
        path: '/transactions',
        title: 'Transactions',
        icon: 'swap',
        component: Transactions,
    },
];
