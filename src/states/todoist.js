import Factory from '~/utils/factory';

export const Name = 'TODOIST';

export const State = {
    sync: null,
    items: [],
};

export const Actions = Factory.actions(Name, {
    ADD: (state, { sync, items }) => ({
        sync,
        items: state.items.concat(items),
    }),
});

export const Reducers = Factory.reducers(State, Name, Actions);
