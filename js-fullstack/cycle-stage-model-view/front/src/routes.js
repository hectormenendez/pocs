import {Router} from './helpers/smv';

export default Router({
    '/'                : 'pages/users',
    '/cuentas'         : 'pages/accounts',
    '/examples/'       : 'pages/examples/router',
    '/examples/todo'   : 'pages/examples/todo',
    '/examples/bmi'    : 'pages/examples/bmi',
    '/examples/socket' : 'pages/examples/socket',
});
