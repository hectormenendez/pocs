import Express from 'express';
import BodyParser from 'body-parser';
import Cors from 'cors';
import {
    graphqlExpress as ExpressGQL,
    graphiqlExpress as ExpressGraphiQL,
} from 'apollo-server-express';
// Local
import Schema from 'schema';

const server = Express();

server.use('*', Cors({ origin: 'http://localhost:3333' }));

server.use(
    '/graphql',
    BodyParser.json(),
    ExpressGQL({ schema: Schema }),
);

server.use(
    '/test',
    BodyParser.json(),
    ExpressGraphiQL({ endpointURL: '/graphql' }),
);

const conf = {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0',
};

server.listen(
    conf.port,
    conf.host,
    () => console.info('Listening on %s:%s', conf.host, conf.port),
);
