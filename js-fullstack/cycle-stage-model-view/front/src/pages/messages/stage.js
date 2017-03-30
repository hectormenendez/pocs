export default function Stage(sources){

    const intent = {};

    intent.userSend$ = sources.DOM
        .select('app-userinput button')
        .events('click')
        .map(e =>  e.target.parentElement.querySelector('input').value);

    intent.chatboxSend$ = sources.DOM
        .select('app-chatbox button')
        .events('click')
        .map(e => {
            const message = e.target
                .parentElement
                .querySelector('input[name=message]')
                .value;
            const user = e.target
                .parentElement
                .querySelector('input[name=user]')
                .value;
            return { message, user };
        });

    const socket = {};

    socket.created$ = sources.Feathers
        .select({ type:'socket', service:'messages', method:'created' })
        .map(({user, message}) => ({ user, message }));

    socket.initial$ = sources.Feathers
        .select({ type:'local', service:'messages', method:'find' })
        .map(({data})=> data)

    return { intent, socket };
}
