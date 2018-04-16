import PropTypes from 'prop-types';

export default function FactoryRedux(initState, declarations, prefix) {
    PropTypes.checkPropTypes(
        {
            initState: PropTypes.any.isRequired,
            declarations: PropTypes.objectOf(PropTypes.shape({
                action: PropTypes.func.isRequired,
                reducer: PropTypes.func.isRequired,
            })),
            prefix: PropTypes.string,
        },
        { initState, declarations, prefix },
        'arguments',
        'FactoryRedux',
    );
    const keys = Object.keys(declarations);
    const prefixer = value => prefix ? `${prefix}/${value}` : value;
    return {

        Actions: keys.reduce((acc, key) => {
            const type = prefixer(key);
            const fabricatedAction = declarations[key].action.bind(null, type);
            return { ...acc, [key]: fabricatedAction };
        }, {}),

        Reducers: function fabricatedReducers(prevState = initState, { type, payload }) {
            const match = keys
                .map(key => ({ key: prefixer(key), reducer: declarations[key].reducer }))
                .filter(({ key }) => key === type);
            // No matching declaration found, this is most likely @@INIT, return state.
            if (!match.length) return prevState;
            return match[0].reducer(prevState, payload);
        },
    };
}
