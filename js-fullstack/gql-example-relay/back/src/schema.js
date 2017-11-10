import { buildSchema as BuildSchema } from 'graphql';

const schema = BuildSchema(`

    input FriendInput {
        id: ID
        nameFirst: String
        nameLast: String
        gender: String
        email: String
        lang: String
   }

    type Friend {
        id: ID
        nameFirst: String
        nameLast: String
        gender: String
        email: String
        lang: String
    }

    type Query {
        getFriend(id: ID!): Friend
    }

    type Mutation {
        createFriend(input: FriendInput): Friend
        updateFriend(id: ID!, input: FriendInput): Friend
    }

`);

export default schema;
