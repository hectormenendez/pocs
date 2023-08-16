import { Platform } from 'react-native';

export default {

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 40,
        marginLeft: 40,
    },

    doubleHeight: {
        marginTop: 40,
        marginBottom: 40,
    },

    time: {
        fontSize: 80,
        textAlign: 'center',
        fontWeight: 'bold',
        ...Platform.select({ ios: { fontFamily: 'Menlo' } }),
    },

    timeDue: {
        color: '#e75053',
    },

    spaceRight: {
        marginRight: 9,
    },

    mdText: {
        fontSize: 18,
        lineHeight: 18,
    },

    mdLink: {
        textDecorationLine: 'underline',
    },

};
