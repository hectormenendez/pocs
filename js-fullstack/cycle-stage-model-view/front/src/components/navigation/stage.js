import $ from 'xstream';

export default function Stage(source){
    const intent = {};

    // A props stream must be sent
    const { props$ } = source;
    if (!props$ || props$.constructor !== $)
        throw new TypeError(`Invalid props$, got: ${typeof props$}`);

    return { props$ };
}
