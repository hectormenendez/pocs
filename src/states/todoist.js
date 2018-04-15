import PropTypes from 'prop-types';
import Factory from '~/utils/factory';

export const Name = 'TODOIST';

export const Types = PropTypes.shape({
    sync: PropTypes.string,
    items: PropTypes.array.isRequired,
});

export const State = {
    sync: null,
    items: [],
};

export const Actions = Factory.actions(Name, {
    add: (state, { sync, items }) => ({
        sync,
        items: state.items.concat(items),
    }),
});

export const Reducers = Factory.reducers(State, Name, Actions);
