import React from 'react';
import ReactDOM from 'react-dom';

import registerServiceWorker from './utils/registerServiceWorker';
import Main from '~/components/main';

import './index.css';

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
