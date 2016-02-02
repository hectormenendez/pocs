'use strict';

import React from 'react';
import {Nav} from 'components';

export default class App extends React.Component {

	static contextTypes = {
		router: React.PropTypes.object.isRequired // enable routing context
	};

	static propTypes = {
		routes: React.PropTypes.array.isRequired, // react-router provides this.
	};

	constructor(props){
		super(props);
		this.handleSearch = this.handleSearch.bind(this);
		this.state = {
			links: [
				{ href:'/',     value:'GithubNoter' },
				{ href:'/test', value:'prueba1'     }
			]
		}
	}

	handleSearch(value){
		// Force the local location change
		this.context.router.push(`/result/${value}`)
	}

	render() {
		const {links} = this.state;
		const {children, route} = this.props;

		return (
			<div className='main-container'>

				<Nav links={links} route={route.path} onSearch={this.handleSearch}/>

				<div className='container' style={{marginTop:'5em'}}>
					{children}
				</div>

			</div>
		)
	}
}