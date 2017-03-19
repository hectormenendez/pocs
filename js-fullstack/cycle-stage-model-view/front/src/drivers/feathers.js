import $        from 'xstream';
import Feathers from 'feathers-client';
import Emitter  from 'event-emitter';

import Validate from '../helpers/validate';

export default function (socket){

    if (!socket) throw new Error('Expecting a socket connection');

    const event = new Emitter();

    // Returns a function that accepts a Sink Stream and returns a source.
    return function (sink$) {

        // The feathers application
        const app = Feathers()
            .configure(Feathers.hooks())
            .configure(Feathers.socketio(socket));

        // Process the received sink stream.
        // - emits the specified method on the socket service
        // - triggers a local event that can be later selected from the sources.
        sink$
            .map(sink => {
                Validate(sink, { service:[String], method:[String], args:Array });
                const service = app.service(sink.service);
                const method  = service[sink.method];
                const args    = sink.args || [];
                if (typeof method !== 'function')
                    throw new Error(`Invalid method '${sink.method}' for ${sink.service}`);
                return $
                    .fromPromise(service[sink.method](...args))
                    .map(response => ({ ...sink, response }));
            })
            .flatten()
            .addListener({
                // just throw the errors if any.
                error: err => { throw err },
                // emit the corresponding event
                next: ({service, method, response}) => event
                    .emit(`${service}:${method}`, response),
            });

        // The source stream that will handle the intents
        return {
            // make this 'hackable', expose the application.
            app,
            // Handles selection (for local events)
            select: selector => {
                Validate(selector, { service:[String], method:[String] });
                const { service, method } = selector;
                function start(listener){
                    return event.on(`${service}:${method}`, function(response){
                        return listener.next(response);
                    })
                }
                return $.create({ start , stop:()=>{} }); // stop won't happen
            },
            // Handles sources selection. (for remote events)
            on: event => {
                Validate(event, { service:[String], method:[String] });
                const service = app.service(event.service);
                function start(listener){
                    return service.on(event.method, function(response){
                        return listener.next(response);
                    })
                }
                return $.create({ start, stop: ()=>{} }) // stop won't happen
            },
        };
    };
}
