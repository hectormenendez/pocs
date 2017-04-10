import Errors from 'feathers-errors';

export default function NotFound(){
    return function NotFoundMiddleware(req, res, next){
        next(new Errors.NotFound('Page not found'));
    }
}
