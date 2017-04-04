/**
 * Common hooks example
 * This is an example of how a hook is written and exported.
 * @see http://docs.feathersjs.com/hooks/readme.htmml
 */
export function myHook(options){
    return function(hook){
        console.log('Custom global hook!');
    }
}
