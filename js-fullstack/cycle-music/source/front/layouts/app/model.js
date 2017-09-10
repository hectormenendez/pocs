import $ from 'xstream';

export const Model = ({ increment$, decrement$ }) => $
    .merge(increment$, decrement$)
    .fold((state, num) => ({ ...state, num: state.num + num }), { num: 0 })

export default Model;
