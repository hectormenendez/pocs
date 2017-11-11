import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { createHttpLink as CreateLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
// Local
import App from 'App';

const apollo = new ApolloClient({
    link: CreateLink({ uri: 'http://localhost:8080/graphql' }),
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <ApolloProvider client={ apollo }>
        <App />
    </ApolloProvider>,
    document.getElementsByTagName('main')[0],
);
