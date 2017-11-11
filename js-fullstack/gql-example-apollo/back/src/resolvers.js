import CRYPTO from 'crypto';

export const Data = [
    {
        id: 1,
        firstName: 'Maria Eugenia',
        lastName: 'Rivera Rodriguez',
    },
    {
        id: 2,
        firstName: 'Mariela Eugenia',
        lastName: 'Vallejo Rivera',
    },
    {
        id: 3,
        firstName: 'Mario Luis',
        lastName: 'Vallejo Verón',
    },
];

export const Resolvers = {
    Query: {
        contacts: () => Data,
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
    },
};

export default {
    data: Data,
    resolvers: Resolvers,
};
