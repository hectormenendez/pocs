import PropTypes from 'prop-types';
import Factory from '~/utils/factory';

export const Name = 'SELECTED';

export const Types = PropTypes.shape({
    item: PropTypes.object,
    time: PropTypes.number,
});

export const State = {
    item: null, // String
    time: null, // Float
};

export const Actions = Factory.actions(Name, {
    setItem: (state, item) => ({ time: State.time, item }),
    setTime: (state, time) => ({ ...state, time }),
    del: () => State,
});


export const Reducers = Factory.reducers(State, Name, Actions);
