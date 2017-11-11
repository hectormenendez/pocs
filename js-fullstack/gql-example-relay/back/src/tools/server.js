// Modules
import Express from 'express';
import ExpressGraphQL from 'express-graphql';
// Local
import Config from 'tools/config';
import Log from 'tools/logger';
import Schema from 'graphql/schema';

const Server = Express();
export default Server;

Server.use('/graphql', ExpressGraphQL({
    graphiql: true,
    pretty: true,
    schema: Schema,
}));

Server.listen(Config.port, Config.host, () =>
    Log.info('Running server on %s:%s', Config.host, Config.port),
);
