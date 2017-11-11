import { makeExecutableSchema as MakeSchema } from 'graphql-tools';
// Local
import { Resolvers } from 'resolvers';
import Schema from './schema.graphql';

const schema = MakeSchema({
    typeDefs: Schema,
    resolvers: Resolvers,
});

export default schema;
