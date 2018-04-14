export const Increment = () => ({ type: 'COUNT/INCREMENT' });
export const Decrement = () => ({ type: 'COUNT/DECREMENT' });

export default {
    increment: Increment,
    decrement: Decrement,
};

