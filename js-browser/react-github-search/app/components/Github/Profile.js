'use strict';

import React from 'react';
import {Github} from 'helpers';

export default class GithubProfile extends React.Component {

	static propTypes = {
		user : React.PropTypes.string.isRequired,
	};

	constructor(props){
		super(props);
		this.state = { info: {} };
		this.handleInit = this.handleInit.bind(this);
	}

	componentWillReceiveProps(props){
		this.handleInit(props.user);
	}

	componentDidMount(){
		this.handleInit(this.props.user);
	}

	componentWillUnmount(){
		this.setState({ info: {} });
	}

	handleInit(user){
		this.setState({ info: {} });
		(new Github(user)).getInfo().then(res => {
			this.setState({ info: res.data})
		});
	}

	render(){

		const {user} = this.props;
		const {info} = this.state;

		return (
			<div>
				<h3>{user}</h3>
				<ul className="list-group">
					{info.avatar_url &&
						<li className="list-group-item">
							<img
								src       = {info.avatar_url}
								style     = {{width: '100%'}}
								className = "img-rounded img-responsive"/>
						</li>
					}

					{info.name &&
						<li className="list-group-item">
							Name: {info.name}
						</li>}

					{info.email &&
						<li className="list-group-item">
							Email: {info.email}
						</li>}

					{info.location &&
						<li className="list-group-item">
							Location: {info.location}
						</li>}

					{info.company &&
						<li className="list-group-item">
							Company: {info.company}
						</li>}

					{info.followers &&
						<li className="list-group-item">
							Followers: {info.followers}
						</li>}

					{info.following &&
						<li className="list-group-item">
							Following: {info.following}
						</li>}

					{info.following &&
						<li className="list-group-item">
							Public Repos: {info.public_repos}
						</li>}

					{info.blog &&
						<li className="list-group-item">
							Blog: <a href={info.blog}> {info.blog}</a>
						</li>}
				</ul>

			</div>
		)
	}
}