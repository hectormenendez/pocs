import React from 'react';
import GQL from 'graphql-tag';
import { graphql as GraphQL } from 'react-apollo';
import { Link } from 'react-router-dom';
// Local
import Loading from 'components/Loading';
import Err from 'components/Error';
import ContactAdd from 'components/Contact/Add';

export const Actions = {};

Actions.Query = GQL`query {
    contacts {
        id
        firstName
        lastName
    }
}`;

export const Component = ({ data: { loading, error, contacts } }) => {
    if (loading) return <Loading/>;
    if (error) return <Err name={ error.name } message={ error.message } />;
    return <ul>
        <ContactAdd/>
        {contacts.map(contact => <li key={ contact.id }>
            <Link to={ `/contact/${contact.id}` }>
                {contact.firstName}
                &nbsp;
                {contact.lastName}
            </Link>
        </li>)}
    </ul>;
};

export default GraphQL(Actions.Query)(Component);
