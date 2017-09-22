import $ from 'xstream';

export const Model = ({ increment$, decrement$ }) => $.merge(
    $.of(state => ({ ...state, num: 0 })),
    increment$.map(num => state => ({ ...state, num: state.num + num })),
    decrement$.map(num => state => ({ ...state, num: state.num + num })),
);

export default Model;
