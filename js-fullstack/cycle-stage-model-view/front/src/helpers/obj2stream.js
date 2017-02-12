import $ from 'xstream';

export default function obj2stream (obj){
    return Object
        .keys(obj)
        .map(_id => ({ _id, $: obj[_id] }))
        .reduce((acc, cur) => {
            const stream = cur.$.map(obj => {
                if (!obj || obj.constructor.name !== Object.name) obj = { value: obj };
                return { ...obj, _id: cur._id }
            });
            if (!acc) return stream;
            return $.merge(acc, stream);
        }, null);
}
