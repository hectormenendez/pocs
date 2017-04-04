import Winston from 'winston';

export default function Logger(app){
    // Add a logger to our app object for convenience
    app.logger = Winston;

    return function LoggerMiddleware(error, req, res, next){
        if (error){
            const code = error.code || '';
            const message = `${code} Route: ${req.url} - ${error.message}`;
            if (error.code === 404) Winston.info(message);
            else {
                Winston.error(message);
                Winston.info(error.stack);
            }
        }
        next(error);
    }
}
