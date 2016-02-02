'use strict';

import React from  'react';
import {Firebase} from 'helpers';

import List     from './List';
import Appender from './Appender'

const STATE = { notes: [] };

export default class Notes extends React.Component {

	static propTypes = {
		user : React.PropTypes.string.isRequired
	};

	constructor(props){
		super(props);
		this.state = STATE;
		this.dataBinding  = null;
		this.handleInit   = this.handleInit.bind(this);
	}

	componentWillReceiveProps(props){
		this.handleInit(props.user);
	}

	componentDidMount(){
		this.handleInit(this.props.user);
	}

	componentWillUnmount(){
		Firebase.removeBinding(this.dataBinding);
	}

	handleInit(user){
		// make sure we only create one binding
		if (this.dataBinding) Firebase.removeBinding(this.dataBinding);
		this.dataBinding = Firebase.bindToState(user, {
			context : this,
			asArray : true,
			state   : 'notes'
		});
	}

	render(){

		const {user}  = this.props;
		const {notes} = this.state;

		return (
			<div>
				<h3>Notes</h3>
				<Appender user={user} notes={notes}/>
				<List notes={notes} />
			</div>
		)
	}
}