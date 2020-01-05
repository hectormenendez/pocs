import { Resolve } from './utils/drivers/router';
import { Resolve as Type } from './utils/types/driver-router'

export const Routes: Type.Routes = [
    { id: 'Home', path: '/' },
    { id: 'Counter', path: '/counter' },
    { id: 'Speaker', path: '/speaker' },
    { id: 'SharedState', path: '/shared-state' },
];

export const Routes$ = Resolve(Routes, ({ id }) => import('./pages/' + id));

export default Routes;
