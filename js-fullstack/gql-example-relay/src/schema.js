import { buildSchema as BuildSchema } from 'graphql';

const schema = BuildSchema(`
    type Friend {
        id: ID
        nameFirst: String
        nameLast: String
        gender: String
        email: String
        lang: String
    }

    type Query {
        friend: Friend
    }
`);

export default schema;
