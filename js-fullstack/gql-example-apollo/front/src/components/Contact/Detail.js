import React from 'react';
import GQL from 'graphql-tag';
import { graphql as GraphQL } from 'react-apollo';
// Local
import Err from 'components/Error';
import Header from 'components/Contact/Header';
import NoteAdd from 'components/Note/Add';
import NoteList from 'components/Note/List';

export const Actions = {};

Actions.Subscription = GQL`subscription ($contactId: ID!) {
    noteAdded(contactId: $contactId) {
        id
        content
    }
}`;

export class Component extends React.Component {

    // Triggers after first component render.
    componentDidMount() {
        const {
            data: { subscribeToMore: subscribe }, // GraphQL data
            match: { params: { id } }, // Router parameters
        } = this.props;
        // Reducer applied everytime new data arrives.
        const updateQuery = (state, { subscriptionData: { noteAdded: note } }) => {
            // Only when a note has changed
            if (!note) return state;
            const { notes } = state.contact;
            // ignore currently existing notes
            if (notes.find(({ id: noteId }) => note.id === noteId)) return state;
            // so this is actually a new note, add them to current stack.
            return {
                ...state,
                contact: {
                    ...state.contact,
                    notes: notes.concat(note),
                },
            };
        };
        subscribe({
            document: Actions.Subscription,
            variables: { contactId: id },
            updateQuery,
        });
    }

    render() {
        const {
            data: { loading, error, contact }, // The fetched data
            match: { params: { id } }, // the id on the URL
        } = this.props;
        if (error) return <Err name={ error.name } message={ error.message } />;
        // While the info is being loaded show the header only
        if (loading) return <Header contactId={ id } />;
        // Data is loaded
        const { notes } = contact;
        return <section>
            { (notes && notes.length && <NoteList notes={ notes }/>) || '' }
            <NoteAdd />
        </section>;
    }

}

Actions.Query = GQL`query ($contactId: ID!) {
    contact(id: $contactId) {
        id
        firstName
        lastName
        notes { id content }
    }
}`;

export default GraphQL(Actions.Query, {
    // gets the id from the route and sends it to the query
    options: ({ match: { params: { id } } }) => ({ variables: { contactId: id } }),
})(Component);
