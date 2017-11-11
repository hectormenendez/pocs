import React from 'react';
import GQL from 'graphql-tag';
import { graphql as GraphQL } from 'react-apollo';

const stateDefault = {
    firstName: '',
    lastName: '',
};

export const Actions = GQL`
    mutation addContact(
        $firstName: String!
        $lastName: String!
    ) {
        addContact(
            firstName: $firstName
            lastName: $lastName
        ) {
            id
            firstName
            lastName
        }
    }
`;

export class Component extends React.Component {

    state = stateDefault;

    handleSubmit = (e) => {
        e.preventDefault();
        const { firstName, lastName } = this.state;
        this.props
            .mutate({
                variables: {
                    firstName,
                    lastName,
                },
            })
            .then(() => this.setState(stateDefault));
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

export default GraphQL(Actions)(Component);
