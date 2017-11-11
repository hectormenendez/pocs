import React from 'react';
import ReactDom from 'react-dom';
import { QueryRenderer, graphql as GraphQL } from 'react-relay';
import {
    Environment,
    Network,
    RecordSource,
    Store,
} from 'relay-runtime';
// Local
import Friends from 'components/friends';

const fetchQuery = (operation, variables) =>
    fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: operation.text, variables }),
    }).then(response => response.json());

const environment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
});

ReactDom.render(
    <QueryRenderer
        environment={ environment }
        query={ GraphQL`
            query IndexQuery {
                viewer {
                    ...Friends_viewer
                }
            }
        `}
        variables={{}}
        render={(error, props) => {
            if (error) return <section><h1>Error</h1></section>;
            // if there aren't props, it means that we're loading.
            if (!props) return <section><h1>Loading</h1></section>;
            // all set.
            return <Friends viewer={ props.viewer } />;
        }}
    />,
    document.getElementsByTagName('main')[0],
);
