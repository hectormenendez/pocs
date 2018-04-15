import Factory from '~/utils/factory';

export const Name = 'SELECTED';

// the whole state will be the selected Item.
export const State = null;

export const Actions = Factory.actions(Name, {
    SET: (state, payload) => payload,
    DEL: () => null,
});

export const Reducers = Factory.reducers(State, Name, Actions);
