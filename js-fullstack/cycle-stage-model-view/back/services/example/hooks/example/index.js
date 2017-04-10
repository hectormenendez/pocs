export default function HookLocalExample(options){
    return hook => {
        console.log('Custom local hook!',  hook);
        return Promise.resolve(hook);
    }
}
