import HTTP from 'http';
import Express from 'express';
import BodyParser from 'body-parser';
import Cors from 'cors';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute as Execute, subscribe as Subscribe } from 'graphql';
import {
    graphqlExpress as ExpressGQL,
    graphiqlExpress as ExpressGraphiQL,
} from 'apollo-server-express';
// Local
import Schema from 'schema';

const server = Express();
const ws = HTTP.createServer(server);

const conf = {
    server: {
        port: process.env.PORT || 8080,
        host: process.env.HOST || '0.0.0.0',
        endpoints: {
            root: '/graphql',
            ui: '/',
            subscriptions: '/subscription',
        },
    },
    client: {
        port: 3333,
        host: 'localhost',
    },
};

server.use('*', Cors({ origin: `http://${conf.client.host}:${conf.client.port}` }));

server.use(
    conf.server.endpoints.root,
    BodyParser.json(),
    ExpressGQL({ schema: Schema }),
);

server.use(
    conf.server.endpoints.ui,
    BodyParser.json(),
    ExpressGraphiQL({
        endpointURL: conf.server.endpoints.root,
        subscriptionsEndpoint: [
            'ws://',
            `${conf.server.host}:${conf.server.port}`,
            conf.server.endpoints.subscriptions,
        ].join(''),
    }),
);

ws.listen(
    conf.server.port,
    conf.server.host,
    () => {
        SubscriptionServer.create( // eslint-disable-line no-new
            {
                schema: Schema,
                execute: Execute,
                subcribe: Subscribe,
            },
            {
                server: ws,
                path: conf.server.endpoints.subscriptions,
            },
        );
        console.info('Listening on %s:%s', conf.server.host, conf.server.port);
    },
);
