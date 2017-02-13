// TODO: for some reason when using this method, the state of the components gets lost.
import $ from 'xstream';
import FlattenSequentially from 'xstream/extra/flattenSequentially';

export default function Component(object){
    // Convert the object into a streamable array
    const keys = Object.keys(object);
    const vals = keys.map(id => ({ id, vnode$: object[id].DOM }));

    /**
     * @return Stream - A stream of streams.
     */
    function getComponentStreams({id, vnode$}){
        return vnode$.map(vnode => {
            vnode._id = id;
            const component = () => vnode;
            return { [id]: component }
        })
    }

    return $
        .from(vals)
        .map(getComponentStreams)
        .flatten()
        .fold((acc, cur) => Object.assign(cur, acc), {})
        .filter(components => Object.keys(components).length == keys.length)
}
    // // Convert the model stream properties into a single stream.
    // // When resolved, call the view with the corresponding values.
    // const vtree$ = $
    //     .from(Object.keys(model))
    //     // Convert the properties into a single object with a key/value
    //     // (and remove any dollar sign present)
    //     .map(key => model[key].map(value => ({ [key.replace('$','')]: value })))
    //     .flatten()
    //     // Convert the object stream into a single object containing everything.
    //     .fold((acc, cur) => Object.assign({}, cur, acc))
    //     .drop(1)
    //     // Just trigger once every stream property has been resolved.
    //     .filter(stream => Object.keys(stream).length === Object.keys(model).length)
    //     .map(view => {
    //         if (!view.state) throw new Error('Expecting a state');
    //         if (!view.vnode) throw new Error('Expecting a vnode');
    //         const { state, vnode } = view;
    //         delete view.state;
    //         delete view.vnode;
    //         return View(state, vnode, view);
    //     });
