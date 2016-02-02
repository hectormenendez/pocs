'use strict';

import React from 'react';
import {Referencer, Firebase} from 'helpers';

function onClick(){
	console.log('Appender»onClick');
	let note = this.note.value;
	this.note.value = '';
	this.props.onNote(note);
}

export default class NotesAppender extends React.Component {

	static propTypes = {
		user  : React.PropTypes.string.isRequired,
		notes : React.PropTypes.array.isRequired
	};

	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e){
		// don't allow the form to be sent normally
		e.preventDefault();
		// make sure there's a value, and if there is, then store it and reset input
		const note = this.appender.value;
		if (!note.length) return false;
		this.appender.value = '';
		// Store the new note on firebase
		Firebase.post(this.props.user, {
			data: this.props.notes.concat([note])
		})
	}

	render() {

		const {user} = this.props;

		return(
			<form
				className = 'form-inline'
				onSubmit  = {this.handleSubmit}>

				<div className='input-group'>
					<input
						type         = 'text'
						className    = 'form-control'
						placeholder  = 'Add note'
						data-refname = 'appender'
						ref          = {Referencer.bind(this)}
					/>
					<span className='input-group-btn'>
						<button
							className = 'btn btn-default'
							type      = 'submit'>
							Submit
						</button>
					</span>
				</div>
			</form>
		)
	}
}