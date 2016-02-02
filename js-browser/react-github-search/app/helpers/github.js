import Axios from 'axios';

export default class Github {

	static endpoint = 'https://api.github.com/';

	constructor(user){
		this.user = user;
		this.url  = `${Github.endpoint}users/${this.user}`;
	}

	getInfo(){
		return Axios.get(this.url);
	}

	getRepos(){
		return Axios.get(`${this.url}/repos`);
	}

	getAll(){
		return Axios
			.all([
				this.getInfo(),
				this.getRepos()
			])
			.then(arr => ({
				info : arr[0].data,
				repos: arr[1].data
			}));
	}
}