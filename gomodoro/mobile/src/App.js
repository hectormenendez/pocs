// Modules (production)
import React from 'react';
import Locale from 'antd-mobile/lib/locale-provider/en_US';
import { StyleSheet } from 'react-native';
import { LocaleProvider } from 'antd-mobile';
import { Provider } from 'react-redux';

import PageIndex from '~/pages';
import { Store as ReduxStore } from '~/utils/redux';
import { Reducers as ReducersTodoist } from '~/stores/todoist';
import { Reducers as ReducersSelected } from '~/stores/selected';
import { Reducers as ReducersGomodoro } from '~/stores/gomodoro';

// Android kinda requires a couple
import '~/utils/polyfills';

import StyleProps from './style';

export const Style = StyleSheet.create(StyleProps);

export const Store = ReduxStore({
    todoist: ReducersTodoist,
    selected: ReducersSelected,
    gomdooro: ReducersGomodoro,
}, {});

export const Component = () =>
    <Provider store={Store}>
        <LocaleProvider locale={Locale}>
            <PageIndex />
        </LocaleProvider>
    </Provider>;

export default Component;
