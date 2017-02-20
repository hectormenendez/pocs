import $ from 'xstream';

export default function Stage(source){

    const props$ = source.props$;
    if (!props$ || props$.constructor !== $) throw new TypeError(
        `Expecting a props Stream, got ${props$? props$.constructor : props$}`
    );

    const intent = {};

    intent.slide$ = source.DOM
        .select('input')
        .events('input')
        .map(e => parseInt(e.target.value, 10));

    return { intent, props$ };
}
