import $ from 'xstream';

export default function Model({ intent, socket }){

    const state = {
        user: null,
        messages: []
    };

    const operator = {}; // --------------------------------------------------------------

    operator.initial$ = socket.initial$
        .map(messages => state => ({ ...state, messages }));

    operator.user$ = intent.userSend$
        .filter(user => user && user.length)
        .map(user => state => ({ ...state, user }));

    operator.messageCreated$ = socket.created$
        .map(message => state => ({
            ...state,
            messages: state.messages.concat(message)
        }));

    const feather = {}; // ---------------------------------------------------------------

    feather.initial$ =  $.of({
        service: 'messages',
        method: 'find',
        args: []
    });

    feather.message$ = intent.chatboxSend$
        .filter(({message}) => message && message.length)
        .map(data => ({
            service: 'messages',
            method: 'create',
            args: [data]
        }));

    // -----------------------------------------------------------------------------------

    return {
        // State sink: allows operators to modify the original state.
        State: $
            .merge(
                operator.initial$,
                operator.user$,
                operator.messageCreated$
            )
            .fold((state, operator) => operator(state), state),
        // Feathers sink: tell the driver to trigger this operations on the DB.
        Feathers: $
            .merge(
                feather.message$,
                feather.initial$
            )
    }
}
