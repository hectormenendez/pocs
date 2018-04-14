/**
 * Shorthand to create Redux actions.
 * for example:
 *     FactorActions('TEST', {
 *         ONE: (state, payload) => ({ value: state.value  + 1 })
 *     });
 * would generate an action named: 'TEST/ONE'.
 * NOTE: The action will have the reducer attached to it in a hidden property, so it can
 *       be used by the `FactoryReducers` method.
 *
 * @param {string} prefix - A prefix for all the generated actions.
 * @param {Object} Actions - An object containing the reducers to be used and
 *                           their corresponding action name.
 */
export const FactoryActions = (prefix, Actions) => Object
    .keys(Actions)
    .map(name => ({ name, reducer: Actions[name] }))
    .reduce((acc, { name, reducer }) => {
        const action = payload => ({ type: `${prefix}/${name}`, payload });
        Object.defineProperty(action, 'reducer', {
            enumerable: false,
            writable: false,
            value: reducer,
        });
        return { ...acc, [name]: action };
    }, {});


/**
 * Shorthand for creating Reducers from given FactoryActions.
 *
 * @param {string} State - The initial state for the reducer.
 * @param {string} prefix - A prefix used in the actions.
 * @param {Actions} Actions - An Actions object created by the FactoryActions method.
 */
export const FactoryReducers = (State, prefix, Actions) =>
    (state = State, { type, payload }) => {
        const match = Object
            .keys(Actions)
            .map(key => `${prefix}/${key}`)
            .filter(key => key === type);
        if (!match.length) return state;
        const action = Actions[match[0].replace(`${prefix}/`, '')];
        return {
            ...state,
            ...action.reducer(state, payload),
        };
    };

export default { actions: FactoryActions, reducers: FactoryReducers };
