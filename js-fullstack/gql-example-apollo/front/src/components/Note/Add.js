import React from 'react';
import GQL from 'graphql-tag';
import { graphql as GraphQL } from 'react-apollo';
import { withRouter as WithRouter } from 'react-router-dom';
// Local
import { Actions as ActionsContact } from 'components/Contact/Detail';

const State = {
    content: '',
};

export const Actions = {};
Actions.MutationAddNote = GQL`mutation ($note: InputNote!) {
    addNote(note: $note) {
        id
        content
    }
}`;

export class Component extends React.Component {

    state = State;

    render() {
        return <form onSubmit={ this.handleSubmit }>
            <input
                type="text"
                name="content"
                placeholder="Write something"
                value={ this.state.content }
                onChange={ this.handleChange }
            />
            <button type="submit">Add</button>
        </form>;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props
            .mutate({
                variables: {
                    note: {
                        contactId: this.props.match.params.id,
                        content: this.state.content,
                    },
                },
                // mock the content while waiting for a response.
                optimisticResponse: {
                    addNote: {
                        __typename: 'Note',
                        id: Math.round(Math.random() * 1000000).toString(),
                        content: this.state.content,
                    },
                },
                // Once the data has come back, update it on the gui.
                update: (store, { data: { addNote } }) => { // eslint-disable-line
                    const props = {
                        query: ActionsContact.Query,
                        variables: { contactId: this.props.match.params.id },
                    };
                    // Run query against store to obtain latest data.
                    const data = store.readQuery(props);
                    // if the note hasn't been added already, add it.
                    if (!data.contact.notes.find(note => note.id === addNote.id))
                        data.contact.notes.push(addNote);
                    // Update the store.
                    store.writeQuery({ ...props, data });
                },
            })
            .then(() => this.setState(State));
        return false;
    };

    handleChange = e => this.setState({ content: e.target.value });


}

export default GraphQL(Actions.MutationAddNote)(WithRouter(Component));
