/**
 * Common hooks example
 * This is an example of how a hook is written and exported.
 * @see http://docs.feathersjs.com/hooks/readme.htmml
 */
export function MyHook(options){
    return function(hook){
        console.log('Custom global hook!', hook);
        return Promise.resolve(hook);
    }
}
