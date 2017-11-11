/* eslint-disable import/no-dynamic-require */

// Native
import PATH from 'path';
import CRYPTO from 'crypto';
// Local
import Config from 'tools/config';

const Data = require(PATH.join(Config.path.root, 'data.json'));

export class User {
    constructor() {
        this.id = '1';
        this.name = 'Héctor Menéndez';
    }
}

export class Friend {
    constructor(props) {
        Object.keys(props).forEach((key) => { this[key] = props[key]; });
        this.id = CRYPTO.randomBytes(10).toString();
    }
}

export const DB = {
    viewer: new User(),
    friends: Data.map(node => new Friend(node)),
};

export const Resolvers = {
    getUser: id => id === DB.viewer.id ? DB.viewer : null,
    getViewer: () => DB.viewer,
    getFriend: id => DB.friends.find(friend => friend.id === id),
    getFriends: () => DB.friends,
};

export default {
    User,
    Friend,
    DB,
    Resolvers,
};
