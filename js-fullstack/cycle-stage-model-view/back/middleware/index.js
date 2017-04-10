import Handler from 'feathers-errors/handler';
import Loader from '../loader';

const middleware = Loader(__dirname);

export default function Middleware(){
    this.use(Handler());
    middleware.forEach(middleware => this.use(middleware.call(this)))
}
