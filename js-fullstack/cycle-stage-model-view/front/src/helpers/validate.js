
export default function (subject, definitions={}){
    const types = [
        String, Number, Array, Function, RegExp, Boolean, Object,
        Symbol, Date, Map, WeakMap, Set, WeakSet, Error, Promise
    ];
    if (subject.constructor !== Object) throw new Error(
        `Invalid subject, expecting an Object, got: ${subject.constructor.name}`
    );
    Object
        .keys(definitions)
        // Validate an normalize definition
        .map(name => {
            let target   = subject[name];
            let value    = definitions[name];
            let required = false;
            if (!value) throw new TypeError(`Invalid type for ${name}.`);
            if (Array.isArray(value)) {
                value = value[0];
                required = true;
            }
            else if (types.indexOf(value) === -1)
                throw new TypeError(`Unknown type for ${name}.`);
            if (required && !target)
                throw new TypeError(`Missing required prop: ${name}`);
            target = target? target.constructor : target;
            return { name, value, required, target }
        })
        // Omit falsy targets
        .filter(definition => definition.target)
        // Validate params
        .forEach(definition => {
            if (definition.value === definition.target) return true;
            const expected = definition.value.name;
            const received = definition.target.name;
            throw new TypeError(
                `Invalid type for '${definition.name}'. ` +
                `expecting ${expected}, got: ${received}`
            );
        });
    return subject;
}
