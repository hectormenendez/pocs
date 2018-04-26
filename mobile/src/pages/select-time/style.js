import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({

    Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 40,
        marginRight: 40,
        ...Platform.select({
            android: {
                marginTop: 10,
                marginBottom: 10,
            },
        }),
    },

    ButtonContainer: {
        position: 'relative',
        ...Platform.select({
            android: {
                width: 100,
                height: 92,
                marginTop: 24,
            },
            ios: {
                marginTop: 20,
                width: 120,
                height: 111,
            },
        }),
    },

    ButtonText: {
        position: 'absolute',
        width: '100%',
        top: '50%',
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 'bold',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        ...Platform.select({
            android: {
                marginTop: -22,
            },
            ios: {
                marginTop: -15,
            },
        }),
    },

    ButtonText1: {
        color: '#627f2f',
        textShadowColor: '#96BE5A',
    },

    ButtonText2: {
        color: '#7D7F25',
        textShadowColor: '#C2CC53',
    },

    ButtonText3: {
        color: '#7F5814',
        textShadowColor: '#E5AF3E',
    },

    ButtonText5: {
        color: '#8C3A0B',
        textShadowColor: '#e98237',
    },

    ButtonText8: {
        color: '#990e07',
        textShadowColor: '#f05032',
    },

    ButtonImage: {
        width: '100%',
        height: '100%',
    },

});
