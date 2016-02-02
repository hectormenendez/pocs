'use strict';

'use strict';

import React from 'react';
import {Github} from 'helpers';

export default class GithubRepos extends React.Component {

	static propTypes = {
		user  : React.PropTypes.string.isRequired
	};

	constructor(props){
		super(props);
		this.state = { repos: [] };
		this.handleInit = this.handleInit.bind(this);
	}

	componentWillReceiveProps(props){
		this.handleInit(props.user);
	}

	componentDidMount(){
		this.handleInit(this.props.user);
	}

	componentWillUnmount(){
		this.setState({ repos: [] });
	}

	handleInit(user){
		this.setState({ repos: [] });
		(new Github(user)).getRepos().then(res => {
			this.setState({ repos: res.data})
		});
	}

	render(){

		const {user}  = this.props;
		const {repos} = this.state;

		return (
			<div>
				<h3>Repos</h3>
				<ul className='list-group'>
					{repos.map((repo, i)=> (
						<li className='list-group-item' key={i}>

							{repo.html_url &&
								<h4>
									<a href={repo.html_url}>{repo.name}</a>
								</h4>}

							{repo.description &&
								<p>{repo.description}</p>}

						</li>
					))}
				</ul>
			</div>
		)
	}
}