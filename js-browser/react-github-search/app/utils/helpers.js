const Axios = require('axios');

const URL = 'https://api.github.com/users/';

function getRepos(username){
	return Axios.get(`${URL}${username}/repos`);
}

function getUserInfo(username){
	return Axios.get(`${URL}${username}`);
}

module.exports = {

	getGithubInfo: function(username){
		return Axios
			.all([
				getRepos(username),
				getUserInfo(username)
			])
			.then(arr => ({
				repos: arr[0].data,
				bio  : arr[1].data
			}))
	}

}