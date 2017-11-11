// Modules
import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from 'graphql';

import {
    connectionArgs as RelayConnArgs,
    connectionDefinitions as RelayConnDefs,
    connectionFromArray as RelayConnFromArray,
    fromGlobalId as RelayFromGlobalId,
    globalIdField as RelayIdField,
    nodeDefinitions as RelayNodeDefs,
} from 'graphql-relay';

// Local
import {
    Friend,
    User,
    Resolvers,
} from 'graphql/database';

const { nodeInterface, nodeField } = RelayNodeDefs(
    /* eslint-disable no-use-before-define */
    (obj) => {
        if (obj instanceof Friend) return typeFriend;
        if (obj instanceof User) return typeUser;
        return null;
    },
    /* eslint-enable no-use-before-define */
    (gid) => {
        const { type, id } = RelayFromGlobalId(gid);
        switch (type) {
            case 'Friend': return Resolvers.getFriend(id);
            case 'User': return Resolvers.getUser(id);
            default: return null;
        }
    },
);

const typeFriend = new GraphQLObjectType({
    name: 'Friend',
    fields: () => ({
        id: RelayIdField('User'),
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        language: { type: GraphQLString },
        gender: { type: GraphQLString },
        email: { type: GraphQLString },
        image: { type: GraphQLString },
    }),
});

const { connectionType: connFriends } = RelayConnDefs({
    name: 'Friend',
    nodeType: typeFriend,
});

const typeUser = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: RelayIdField('User'),
        friends: {
            type: connFriends,
            args: RelayConnArgs,
            resolve: (_, args) => RelayConnFromArray(Resolvers.getFriends(), args),
        },
    }),
    interface: [nodeInterface],
});

const typeQuery = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        node: nodeField,
        viewer: {
            type: typeUser,
            resolve: () => Resolvers.getViewer(),
        },
    }),
});

export default new GraphQLSchema({
    query: typeQuery,
});
