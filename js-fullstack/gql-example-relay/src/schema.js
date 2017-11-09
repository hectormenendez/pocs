import { buildSchema as BuildSchema } from 'graphql';

const schema = BuildSchema(`
    type Query {
        hello: String
    }
`);

export default schema;
