import {
    Reducers as ReducersGoogle,
    Actions as ActionsGoogle,
    Types as TypesGoogle,
} from './google';

import {
    Reducers as ReducersRoutes,
    Actions as ActionsRoutes,
    Types as TypesRoutes,
} from './routes';

import {
    Reducers as ReducersError,
    Actions as ActionsError,
    Types as TypesError,
} from './error';

export const Reducers = {
    google: ReducersGoogle,
    routes: ReducersRoutes,
    error: ReducersError,
};

export const Actions = {
    google: ActionsGoogle,
    routes: ActionsRoutes,
    error: ActionsError,
};

export const Types = {
    google: TypesGoogle,
    routes: TypesRoutes,
    error: TypesError,
};

export default {
    actions: Actions,
    reducers: Reducers,
    types: Types,
};
