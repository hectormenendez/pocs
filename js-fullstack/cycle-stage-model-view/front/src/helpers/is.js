export function TypeObject(o) {
    return o !== null && typeof o === 'object' && !Array.isArray(o);
}

export function TypeObjectPrototype(o) {
    return TypeObject(o) && Object.prototype.toString.call(o) === '[object Object]';
}

export function TypeObjectPlain(o) {
    return (
        TypeObjectPrototype(o)
        && typeof o.constructor === 'function'
        && TypeObjectPrototype(o.constructor.prototype)
        && o.constructor.prototype.hasOwnProperty('isPrototypeOf')
    );
}

export default {
    object: TypeObject,
    objectPrototype: TypeObjectPrototype,
    objectPlain: TypeObjectPlain,
};