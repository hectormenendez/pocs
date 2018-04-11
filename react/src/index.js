import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Layout from '~/layouts';
import registerServiceWorker from '~/utils/registerServiceWorker';
import './index.css';

ReactDOM.render(
    <Router>
        <Layout />
    </Router>,
    document.getElementsByTagName('main')[0],
);

registerServiceWorker();
