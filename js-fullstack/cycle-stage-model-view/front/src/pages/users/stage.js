import $ from 'xstream';

export default function Stage(sources){

    const intent = {}; // ----------------------------------------------------------------

    intent.userCreate$ = sources.DOM
        .select('form > button')
        .events('click')
        // get all the fieldsets on the parent
        .map(e => {
            e.preventDefault()
            const nodes = e.target.parentNode.querySelectorAll('input');
            // convert nodelist to array, and then to an object containing name:value
            return [].slice.call(nodes)
                .map(node => ({ name:node.getAttribute('name'), value:node.value }))
                .reduce((result, item) => ({ ...result, [item.name]:item.value }), {})
        });

    // Intention of deleting an user.
    intent.userDelete$ = sources.DOM
        .select('section > article button')
        .events('click')
        // Only when the user is really sure.
        .filter(e => window.confirm(e.target.dataset.confirm))
        // Return the user id contained on the first article parent.
        .map(e => {
            let target = e.target;
            do { target = target.parentNode; }
            while(target && target.nodeName != 'ARTICLE')
            if (!target) throw new Error('Invalid Parent');
            return target.dataset.id;
        });

    const socket = {}; // ----------------------------------------------------------------

    // The list of users available initially
    socket.users$ = sources.Feathers
        .select({ service:'users', method:'find' })
        .map(response => response.data)

    // User was deleted from DB
    socket.userDeleted$ = sources.Feathers
        .on({ service:'users', method:'removed' })
        .map(user => user._id)

    // User was created on DB
    socket.userCreated$ = sources.Feathers
        .on({ service:'users', method:'created' })

    return { socket, intent };
}
