var React = require('react');


module.exports = React.createClass({

	propTypes: {
		username : React.PropTypes.string.isRequired,
		addNote  : React.PropTypes.func.isRequired
	},

	setRef: function(ref){
		console.log('AddNote»setRef', ref);
		this.note = ref;
	},

	handleSubmit: function(){
		console.log('AddNote»handleSubmit', this.note.value);
		var note = this.note.value;
		this.note.value = '';
		this.props.addNote(note);
	},

	render: function(){
		console.log('AddNote»render', this.props);
		return(
			<div className='input-group'>
				<input
					type        = 'text'
					className   = 'form-control'
					placeholder = 'Add new note'
					ref         = {this.setRef}
				/>
				<span className='input-group-btn'>
					<button
						className = 'btn btn-default'
						type      = 'button'
						onClick   = {this.handleSubmit}
					>
						Submit
					</button>
				</span>
			</div>
		)
	}
});