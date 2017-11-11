import {
    makeExecutableSchema as MakeSchema,
    addMockFunctionsToSchema as MockSchema,
} from 'graphql-tools';
// Local
import Schema from './schema.graphql';

const schema = MakeSchema({ typeDefs: Schema });

MockSchema({ schema });

export default schema;
