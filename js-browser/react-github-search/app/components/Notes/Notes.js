var React = require('react');

var NotesList = require('./NotesList');
var AddNote   = require('./AddNote');

module.exports = React.createClass({

	propTypes: {
		username : React.PropTypes.string.isRequired,
		notes    : React.PropTypes.array.isRequired,
		addNote  : React.PropTypes.func.isRequired
	},

	render: function(){
		console.log('Notes»render', this.props);
		return (
			<div>
				<h3>Notes</h3>
				<AddNote
					username = {this.props.username}
					addNote  = {this.props.addNote}
				/>
				<NotesList
					notes = {this.props.notes}
				/>
			</div>
		)
	}
});