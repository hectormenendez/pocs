import React  from 'react';
import Rebase from 're-base';

import Notes            from 'components/Notes'
import {Repos, Profile} from 'components/Github'

export default class Result extends React.Component {

	constructor(props){
		super(props);
		this.state = { user : props.params.user }
	}

	componentWillReceiveProps(props){
		this.setState({ user:props.params.user });
	}

	render(){
		const {user} = this.state;

		return(

			<div className='row'>
				<div className='col-xs-4'>
					<Profile user={user} />
				</div>

				<div className='col-xs-4'>
					<Repos user={user} />
				</div>

				<div className='col-xs-4'>
					<Notes user = {user} />
				</div>
			</div>
		)
	}
}