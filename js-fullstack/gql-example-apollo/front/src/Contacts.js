import React from 'react';
import GQL from 'graphql-tag';
import { graphql as GraphQL } from 'react-apollo';

export const Query = GQL`
    query ContactsQuery {
        contacts {
            id
            firstName
            lastName
        }
    }
`;

export const Component = ({ data: { loading, error, contacts } }) => {
    if (loading) return <p>Loading … </p>;
    if (error) return <p>{ error.message }</p>;
    return <ul>
        {contacts.map(contact => <li key={ contact.id }>
            {contact.firstName}
            &nbsp;
            {contact.lastName}
        </li>)}
    </ul>;
};

export default GraphQL(Query)(Component);
