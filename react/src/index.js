import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// import Main from '~/components/main';
import Layout from '~/layout';
import registerServiceWorker from '~/utils/registerServiceWorker';

import './index.css';

ReactDOM.render(
    <Router>
        <Layout />
    </Router>,
    document.getElementsByTagName('main')[0],
);
registerServiceWorker();
