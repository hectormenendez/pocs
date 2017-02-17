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

        // Handles errors on the sink$ listener
        const error = err => { throw new Error(`Feathers : ${err.message}`) };

        // Handles success on the sink$ listener
        const next = ({service, method, response}) => event
            .emit(`${service}:${method}`, response)

        // Handles sources (events result) selection.
        const select = selector => {
            Validate(selector, { service:[String], method:[String] });
            const { service, method } = selector;
            return $.create({
                stop  : () => {},
                start : listener => event
                    .on(`${service}:${method}`, response => listener.next(response))
            })
        };

        // The sink stream that will handle the event queue
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
            .addListener({ error, next })

        // The source stream that will handle the intents
        return { app, select };
    };
}
