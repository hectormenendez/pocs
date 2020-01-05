import { Resolve } from './utils/drivers/router';

export const Routes = [
    { id: 'Counter', path: '/counter' },
    { id: 'Speaker', path: '/speaker' },
    { id: 'Home', path: '/' },
];

export const Routes$ = Resolve(Routes, ({ id }) => import('./pages/' + id));

export default Routes;
