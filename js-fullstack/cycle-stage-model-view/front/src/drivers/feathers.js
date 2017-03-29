import $ from 'xstream';
import Feathers from 'feathers-client';
import Debug from 'debug';
import Validate from '@gik/validate';


export default function (socket){

    if (!socket) throw new Error('Expecting a socket connection');

    const debug = Debug('feathers:driver');

    const client = Feathers()
        .configure(Feathers.hooks())
        .configure(Feathers.socketio(socket))

    // Returns a function that accepts a Sink Stream and returns a source.
    return function (sink$) {

        // Process the received sink stream.
        // - emits the specified method on the socket service
        // - triggers a local event that can be later selected from the sources.
        sink$
            .map(sink => {
                Validate(sink, {
                    service:{ type:String, required:true },
                    method:{ type:String, required:true },
                    args:{ type:Array, value:[] }
                });
                const event = `${sink.service}::${sink.method}`;
                const service = client.service(sink.service);
                const method = service[sink.method];
                const args = sink.args || [];
                if (typeof method !== 'function')
                    throw new Error(`Invalid method '${sink.method}' for ${sink.service}`);
                debug(`sink request → ${event}`, args);
                return $
                    .fromPromise(service[sink.method](...args))
                    .map(response => ({ ...sink, response, event }))
            })
            .flatten()
            .addListener({
                error: error => { throw error },
                next : sink => {
                    // emit locally
                    debug(`sink response → ${sink.event}`, sink.response);
                    client.emit(sink.event, sink.response);
                }
            })

        // The source stream that will handle the intents
        return {
            // Handles selection (for local events)
            on: selector => {
                const { type, service, method } = Validate(selector, {
                    service:{ type:String, required:true },
                    method:{ type:String, required:true },
                    type:{ type:String, required:true },
                })
                const event = `${service}::${method}`;
                return $.create({ stop(){}, start(listener){
                    const handler = response => {
                        debug(`source ${type}:emitted → ${service}::${method}`, response);
                        listener.next(response);
                    };
                    if (type == 'local') client.on(event, handler);
                    if (type == 'socket') client.service(service).on(method, handler);
                    debug(`source ${type}:added → ${event}`)
                }});
            },
        };
    };
}

function typeValidate(type, event){
    const types = ['local', 'socket'];
    const msg = `Invalid type for ${event}, expecting [${types.join(',')}]; got: ${type}`;
    if (types.indexOf(type) === -1) throw new Error(msg);
    return true;
}
