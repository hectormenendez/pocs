/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { split as ApolloSplitLink } from 'apollo-link';
import { createHttpLink as ApolloLink } from 'apollo-link-http';
import { InMemoryCache as ApolloCache } from 'apollo-cache-inmemory';
import { WebSocketLink as ApolloSocket } from 'apollo-link-ws';
import { getMainDefinition as ApolloDef } from 'apollo-utilities';
import { SubscriptionClient as SubsClient } from 'subscriptions-transport-ws';
import { BrowserRouter as Router } from 'react-router-dom';
// Local
import App from 'layouts/App';

const cache = new ApolloCache();
const link = ApolloSplitLink(
    ({ query }) => {
        const { kind, operation } = ApolloDef(query);
        return kind === 'OperationDefinition' && operation == 'suscription';
    },
    // linkHttp
    ApolloLink({ uri: 'http://localhost:8080/graphql' }),
    // linkSubscription
    new ApolloSocket({
        uri: 'ws://localhost:8080/subscription',
        options: {
            reconnect: true
        }
    }),
);

ReactDOM.render(
    <ApolloProvider client={ new ApolloClient({ link, cache }) }>
        <Router>
            <App />
        </Router>
    </ApolloProvider>,
    document.getElementsByTagName('main')[0],
);
