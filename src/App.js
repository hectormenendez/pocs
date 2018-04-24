// Modules (production)
import React from 'react';
import Locale from 'antd-mobile/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd-mobile';
import { Provider } from 'react-redux';

import PageIndex from '~/pages';
import { Store as ReduxStore } from '~/utils/redux';
import { Reducers as ReducersTodoist } from '~/stores/todoist';
import { Reducers as ReducersSelected } from '~/stores/selected';

// These are mostly for android.
import '~/utils/polyfills';

const Store = ReduxStore({
    todoist: ReducersTodoist,
    selected: ReducersSelected,
}, {});

export const Component = () =>
    <Provider store={Store}>
        <LocaleProvider locale={Locale}>
            <PageIndex />
        </LocaleProvider>
    </Provider>;

export default Component;
