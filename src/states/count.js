import Factory from '~/utils/factory';

export const Name = 'COUNT';

export const State = {
    value: 0,
};

export const Actions = Factory.actions(Name, {
    INCREMENT: state => ({ value: state.value + 1 }),
    DECREMENT: state => ({ value: state.value - 1 }),
});

export const Reducers = Factory.reducers(State, Name, Actions);
