import Handler from 'feathers-errors/handler';

import NotFound from './notfound';
import Logger from './logger';

export default function Middleware(){
    const app = this;
    app.use(NotFound());
    app.use(Logger(app));
    app.use(Handler());
}
