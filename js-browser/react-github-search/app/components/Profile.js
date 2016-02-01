var React     = require('react');
var Firebase  = require('firebase');
var Router    = require('react-router');
var ReactFire = require('reactfire');

var Helpers = require('../utils/helpers');

var Repos       = require('./Github/Repos');
var UserProfile = require('./Github/UserProfile');
var Notes       = require('./Notes/Notes');

var Profile = React.createClass({

	mixins: [ReactFire], // adds bindsAsArray, unbind, etc.

	getInitialState: function(){
		console.log('Profile»getInitialState');
		return {
			notes : [],
			bio   : {},
			repos : []
		}
	},

	componentDidMount: function(){
		console.log('Profile»componentDidMount');
		this.ref = new Firebase('https://et0r.firebaseio.com/');
		this.init(this.props.params.username);
	},

	componentWillReceiveProps:function(props){
		console.log('Profile»componentWillReceiveProps', props);
		this.unbind('notes');
		this.init(props.params.username);
	},

	componentWillUnmount:function(){
		console.log('Profile»componentWillUnmount');
		this.unbind('notes');
	},

	handleGithubInfo: function(data){
		console.log('Profile»handleGithubInfo', data);
		this.setState({
			bio   : data.bio,
			repos : data.repos
		})
	},

	handleAddNote: function(note){
		console.log('Profile»handleAddNote');
		// firebase new note
		this.ref.child(this.props.params.username)
			.child(this.state.notes.length)
			.set(note);
	},

	init: function(username){
		console.log('Profile»init');
		var childRef = this.ref.child(username);
		this.bindAsArray(childRef, 'notes');

		Helpers
			.getGithubInfo(username)
			.then(this.handleGithubInfo)

	},

	render: function(){
		console.log('Profile»render');
		return(

			<div className='row'>

				<div className='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
					<UserProfile
						username = {this.props.params.username}
						bio      = {this.state.bio}
					/>
				</div>

				<div className='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
					<Repos
						username = {this.props.params.username}
						repos    = {this.state.repos}
					/>
				</div>

				<div className='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
					<Notes
						username = {this.props.params.username}
						notes    = {this.state.notes}
						addNote  = {this.handleAddNote}
					/>
				</div>

			</div>
		)}
});

module.exports = Profile;