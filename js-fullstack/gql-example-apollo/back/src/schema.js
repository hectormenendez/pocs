import {
    makeExecutableSchema as MakeSchema,
    addMockFunctionsToSchema as MockSchema,
} from 'graphql-tools';
// Local
import { Resolvers } from 'resolvers';
import Schema from './schema.graphql';

const schema = MakeSchema({
    typeDefs: Schema,
    resolvers: Resolvers,
});

MockSchema({ schema });

export default schema;
