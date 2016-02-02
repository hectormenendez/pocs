'use strict';

import React  from 'react';
import {Referencer} from 'helpers';

function onSubmit(e){
	// don't allow the form to be sent
	e.preventDefault();
	// store the search input's value and make sure it has something before triggering
	const value = this.search.value;
	if (!value.length) return false;
	// make sure the input is reset and trigger the callback
	this.search.value = '';
	this.props.onSubmit(value);
}

export default class GithubSearch extends React.Component {

	static propTypes = {
		onSubmit: React.PropTypes.func.isRequired
	};

	render() {
		return(
			<form
				className = 'form-inline pull-xs-right'
				onSubmit  = {onSubmit.bind(this)}>

				<div className='input-group'>
					<input
						type         = 'text'
						className    = 'form-control'
						placeholder  = 'Search'
						data-refname = 'search'
						ref          = {Referencer.bind(this)}
					/>
					<span className='input-group-btn'>

						<button
							className ='btn btn-success'
							type      ='submit'>
							Search
						</button>
					</span>
				</div>
			</form>
		)
	}
}