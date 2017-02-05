import Feathers from 'feathers-client';

import Source from './source'

const Sources  = [];

export default function (socket){

    if (!socket) throw new Error('Expecting a socket connection');

    return sink$ => ({
        app: Feathers()
            .configure(Feathers.hooks())
            .configure(Feathers.socketio(socket)),

        select(name){
            let source = Sources.find(source => name === source.name);
            if (!source){
                source = {name, service: new Source(this.app, name)};
                Sources.push(source);
            }
            return source.service;
        }
    });
}
