import { Platform } from 'react-native';

import { Background } from '~/style';

export default {

    Container: {
        ...Background,
        ...Platform.select({ android: { paddingTop: 24 } }),
    },

    ContainerFlex: {
        height: '100%',
    },

    ContainerTextArea: {
        zIndex: 1,
        width: '100%',
    },

    ContainerContent: {
        zIndex: 0,
        width: '100%',
        paddingLeft: 24,
        paddingRight: 24,
        ...Platform.select({ android: { paddingBottom: 24 } }),
    },

};

