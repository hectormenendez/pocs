// Native
import Crypto from 'crypto';
// Modules
import Express from 'express';
import ExpressGraphQL from 'express-graphql';
// Local
import Config from 'config';
import Log from 'logger';
import Schema from 'schema';

const Server = Express();
export default Server;

Server.get('/', (request, response) => {
    response.send('GraphQL & Relay modern is cools!!!');
    return true;
});

class Friend {
    constructor(id, data) {
        this.id = id;
        this.nameFirst = data.nameFirst;
        this.nameLast = data.nameLast;
        this.gender = data.gender;
        this.email = data.email;
        this.lang = data.lang;
    }
}

const memory = {};

const global = {
    getFriend: ({ id }) => new Friend(id, memory[id]),
    createFriend: ({ input }) => {
        const id = Crypto.randomBytes(10).toString('hex');
        memory[id] = input;
        return new Friend(id, input);
    },
    updateFriend: ({ id, input }) => {
        memory[id] = input;
        return new Friend(id, input);
    },
};

Server.use('/graphql', ExpressGraphQL({
    graphiql: true,
    schema: Schema,
    rootValue: global,
}));

Server.listen(Config.port, Config.host, () =>
    Log.info('Running server on %s:%s', Config.host, Config.port),
);
