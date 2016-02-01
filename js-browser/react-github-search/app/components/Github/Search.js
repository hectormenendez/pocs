var React = require('react');
var Router = require('react-router');

module.exports = React.createClass({

	mixins: [Router.History],

	handleSubmit: function(){
		var username = this.ref_username.value;
		this.ref_username.value = '';
		// react history mixin
		this.history.pushState(null, '/profile/' + username);
	},

	getRef:function(ref){
		this.ref_username = ref;
	},

	render:function(){
		console.log('Github»Search»render');
		return(

			<div className='col-sm-12'>
				<form onSubmit={this.handleSubmit}>
					<div className='form-group col-sm-7'>
						<input
							type      = 'text'
							className = 'form-control'
							ref       = {this.getRef}/>
					</div>
					<div className='form-group col-sm-5'>
						<button
							type      = 'submit'
							className = 'btn btn-block btn-primary'>
							Search Github
						</button>
					</div>
				</form>
			</div>
		)
	}

});