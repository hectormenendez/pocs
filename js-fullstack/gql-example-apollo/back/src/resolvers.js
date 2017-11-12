import CRYPTO from 'crypto';
import { PubSub, withFilter as WithFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const Data = [
    {
        id: 1,
        firstName: 'Maria Eugenia',
        lastName: 'Rivera Rodriguez',
        notes: [
            {
                id: '1',
                content: 'Mi mami chula.',
            },
            {
                id: '2',
                content: 'Es una enojona.',
            },
        ],
    },
    {
        id: 2,
        firstName: 'Mariela Eugenia',
        lastName: 'Vallejo Rivera',
        notes: [
        ],
    },
    {
        id: 3,
        firstName: 'Mario Luis',
        lastName: 'Vallejo Verón',
        notes: [
        ],
    },
];

export const Resolvers = {
    Query: {
        contacts: () => Data,
        contact: (root, { id }) => Data.find(contact => contact.id === id),
    },
    Mutation: {
        addContact: (root, { firstName, lastName }) => {
            const contact = {
                id: CRYPTO.randomBytes(5).toString('hex'),
                firstName,
                lastName,
            };
            Data.push(contact);
            return contact;
        },
        addNote: (root, { note: { contactId, content } }) => {
            const contact = Data.find(item => item.id === contactId);
            const note = {
                id: CRYPTO.randomBytes(5).toString('hex'),
                content,
            };
            contact.push(note);
            pubsub.publish('noteAdded', { note, contactId });
            return note;
        },
    },
    Subscription: {
        noteAdded: {
            subscribe: WithFilter(
                () => pubsub.asyncIterator('noteAdded'),
                ({ contactId }, variables) => variables.contactId === contactId,
            ),
        },
    },
};

export default {
    data: Data,
    resolvers: Resolvers,
};
