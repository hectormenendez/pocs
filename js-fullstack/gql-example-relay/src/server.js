// Modules
import Express from 'express';
// Local
import Config from 'config';
import Log from 'logger';

const Server = Express();
export default Server;

Server.get('/', (request, response) => {
    response.send('GraphQL & Relay modern is cools!!!');
    return true;
});

Server.listen(Config.port, Config.host, () =>
    Log.info('Running server on %s:%s', Config.host, Config.port),
);
