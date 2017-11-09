// Modules
import Express from 'express';
import ExpressGraphQL from 'express-graphql';
// Local
import Config from 'config';
import Log from 'logger';
import Schema from 'schema';

const Server = Express();
export default Server;

Server.get('/', (request, response) => {
    response.send('GraphQL & Relay modern is cools!!!');
    return true;
});

const resolvers = {
    friend: () => ({
        id: 322321,
        nameFirst: 'Hector',
        nameLast: 'Menendez',
        gender: 'F',
        email: 'etor@gik.mx',
        lang: 'ES',
    }),
};

Server.use('/graphql', ExpressGraphQL({
    graphiql: true, // enable GUI
    schema: Schema,
    rootValue: resolvers,
}));

Server.listen(Config.port, Config.host, () =>
    Log.info('Running server on %s:%s', Config.host, Config.port),
);
