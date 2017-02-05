
import $ from 'xstream';

export default class Source {

    constructor(app, name){
        this.name    = name;
        this.service = app.service(name);
    }

    /**
     * Retrieves a list of all records from the service.
     * Provider params will be passed as `params.query`
     */
    find(...args){
        const found = this.service.find(...args);
        return $.fromPromise(found);
    }

    /**
     * Retrieves a single record with given `id` from the service.
     *
     * @param {mixed} id The record matching this `id` will be retrieved.
     */
    get(...args){
        const gotten = this.service.find(...args);
        return $
            .fromPromise(gotten)
            .map(response => response.total > 0? response.data : null)
    }

    /**
     * Creates new data on the service.
     *
     * @param {mixed} data - A record object or an array of record objects to be created.
     */
    create(...args){
        const created = this.service.create(...args);
        return $.fromPromise(created);
    }

    /**
     * Updates a specific record on the service.
     *
     * @param {mixed} id   - The record matching this `id` will be updated.
     * @param {mixed} data - A record object containing the updated record.
     */
    update(...args){
        const updated = this.service.update(...args);
        return $.fromPromise(updated);
    }

    /**
     * Removes a specific record on the service.
     *
     * @param {mixed} id   - The record matching this `id` will be removed.
     */
    remove(...args){
        const removed = this.service.remove(...args);
        return $.fromPromise(removed);
    }

    /**
     * Creates an event listener for given event name.
     *
     * Standard events:
     * - created
     * - updated
     * - removed
     *
     * @param {string} name - The name of the event to be registered.
     */
    events(name){
        const service = this.service;
        return $.create({
            listener: null,
            start(listener){
                this.listener = function(data){
                    listener.next(data);
                }
                service.on(name, this.listener);
            },
            stop(){
                service.removeListener(name, this.listener);
            }
        })
    }
}
