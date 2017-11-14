import React from 'react';
import GQL from 'graphql-tag';
import { graphql as GraphQL } from 'react-apollo';
// Local
import { Actions as ActionsComponentList } from 'components/Contact/List';

export const State = {
    firstName: '',
    lastName: '',
};

export const Actions = {};
Actions.MutationAddContact = GQL`mutation ($firstName: String! $lastName: String!) {
    addContact(firstName: $firstName lastName: $lastName) {
        id
        firstName
        lastName
    }
}`;

export class Component extends React.Component {

    state = State;

    handleSubmit = (e) => {
        e.preventDefault();
        const { firstName, lastName } = this.state;
        this.props
            .mutate({
                variables: {
                    firstName,
                    lastName,
                },
                // Mock the response while waiting for it.
                optimisticResponse: {
                    addContact: {
                        __typename: 'Contact',
                        id: Math.round(Math.random() * 1000000).toString(),
                        firstName,
                        lastName,
                    },
                },
                // Update the store after running the mutation so the changes are
                // reflected immediately.
                update: (store, { data: { addContact } }) => {
                    const data = store.readQuery({ query: ActionsComponentList.Query });
                    data.contacts.push(addContact);
                    store.writeQuery({ query: ActionsComponentList.Query, data });
                },
            })
            .then(() => this.setState(State));
        return false;
    }

    handleChange = e => this.setState({
        [e.target.name]: e.target.value,
    });

    render() {
        return <form >
            <input
                name="firstName"
                value={ this.state.firstName }
                placeholder='First name'
                onChange={ this.handleChange }
            />
            <input
                name="lastName"
                value={ this.state.lastName }
                placeholder='Last name'
                onChange={ this.handleChange }
            />
            <button type="submit" onClick={ this.handleSubmit }>Save</button>
        </form>;
    }

}

export default GraphQL(Actions.MutationAddContact)(Component);
