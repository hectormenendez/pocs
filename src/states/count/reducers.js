export const State = {
    value: 0,
};

export default (state = State, action) => {
    switch (action.type) {
        case 'COUNT/INCREMENT': return { ...state, value: state.value + 1 };
        case 'COUNT/DECREMENT': return { ...state, value: state.value - 1 };
        default: return state;
    }
};

