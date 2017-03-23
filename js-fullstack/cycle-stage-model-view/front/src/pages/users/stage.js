import $ from 'xstream';
import Form from '../../components/form';

export default function Stage(sources){

    const component = {};
    component.form = Form(sources);

    const intent = {}; // ----------------------------------------------------------------

    // Intention of deleting an user from the table
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

    return { socket, intent, component };
}
