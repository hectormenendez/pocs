import React from 'react';
import GQL from 'graphql-tag';
import { graphql as GraphQL } from 'react-apollo';
// Local
import Err from 'components/Error';
import Loading from 'components/Loading';

export const Component = ({ data: { loading, error, contact } }) => {
    if (loading) return <Loading/>;
    if (error) return <Err/>;
    return <section>
        {contact.firstName}
        &nbsp;
        {contact.lastName}
    </section>;
};

export const Actions = GQL`
    query QueryContact($contactId: ID!) {
        contact(id: $contactId) {
            id
            firstName
            lastName
        }
    }
`;

export default GraphQL(Actions, {
    options: ({ contactId }) => ({ variables: { contactId } }),
})(Component);
