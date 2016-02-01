var React = require('react');

module.exports = React.createClass({

	propTypes: {
		username : React.PropTypes.string.isRequired,
		repos    : React.PropTypes.array.isRequired
	},

	render: function(){
		console.log('Repos»render', this.props);

		var repos = this.props.repos.map((repo, i)=> {
			return (
				<li className='list-group-item' key={i}>
					{repo.html_url &&
						<h4>
							<a href={repo.html_url}>{repo.name}</a>
						</h4>
					}

					{repo.description &&
						<p>{repo.description}</p>
					}
				</li>
			)
		});

		return (
			<div>
				<h3> Repos</h3>
				<ul className='list-group'>
					{repos}
				</ul>
			</div>
		)

	}
});