'use strict';

import React    from 'react';
import {Link}   from 'react-router';
import {Search} from 'components/Github';

export default class Nav extends React.Component {

	static propTypes = {
		links    : React.PropTypes.array.isRequired,
		route    : React.PropTypes.string.isRequired, // the current route
		onSearch : React.PropTypes.func.isRequired    // callback for search
	};

	render(){

		const {route, onSearch} = this.props;
		const links   = this.props.links.slice(); // prop will be modified, copy it before.
		const title   = links.shift();

		return (
			<nav className='navbar navbar-full navbar-fixed-top navbar-dark bg-primary'>

				{/* BRAND */}
				<Link className='navbar-brand' to={title.href}>{title.value}</Link>

				{/* MENU */}
				<ul className='nav navbar-nav'>
					{links.map((link, i) => (
						<li
							key       = {i}
							className = {`nav-item ${route == link.href ? 'active' : ''}`}>
							<Link className='nav-link' to={link.href}>
								{link.value}
							</Link>
						</li>
					))}
				</ul>

				{/* SEARCH */}
				<Search onSubmit={onSearch}/>
			</nav>
		)
	}
}
