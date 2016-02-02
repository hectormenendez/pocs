'use strict';

import React from 'react';
import {Router, hashHistory, Route, IndexRoute} from 'react-router';
import {App, Home, Result} from 'components'

export default (
	<Router history={hashHistory}>
		<Route path='/' component={App}>
			<IndexRoute component={Home} />
			<Route path='result/:user' component={Result} />
		</Route>
	</Router>
);