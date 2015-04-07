'use strict';

const Twit   = require('twit');
const LoDash = require('lodash');

const twit = new WeakMap();

const Wrap = function(method, url, options){
	let tw = twit.get(this);
	return new Promise(function(resolve, reject){
		tw[method](url, options, function(err, res){
			if (err) return reject(err);
			return resolve(res);
		});
	});
};

const WrapFollow = function(){
	let self = this;
	return new Promise(function(resolve, reject){
		(async function wrapfollow(){
			let following;
			let followers;
			try {
				following = await self.getFollowing();
				followers = await self.getFollowers();
			} catch (e){
				return reject(e);
			}
			return resolve({
				following: following.ids,
				followers: followers.ids
			});
		})();
	});
};

module.exports = class {

	constructor(conf){
		if (!conf || conf.constructor !== Object) conf = {};
		twit.set(this, new Twit(conf));
	}

	listen(keywords){
		return twit.get(this).stream('statuses/filter', {track: keywords.join(',')});
	}

	tweet(message){
		return Wrap.call(this, 'post', 'statuses/update', { status:message });
	}

	follow(userID){
		return Wrap.call(this, 'post', 'friendships/create', { user_id: userID });
	}

	unfollow(userID){
		return Wrap.call(this, 'post', 'friendships/destroy', { user_id: userID });
	}

	favorite(tweetID){
		return Wrap.call(this, 'post', 'favorites/create', { id: tweetID });
	}

	getUser(userID){
		return Wrap.call(this, 'get', 'users/show', { user_id: userID});
	}

	getFollowing(){
		return Wrap.call(this, 'get', 'friends/ids', {});
	}

	getFollowers(){
		return Wrap.call(this, 'get', 'followers/ids', {});
	}

	getFollowersOnly(){
		return WrapFollow.call(this).then(function(users){
			return Promise.resolve(LoDash.difference(users.followers, users.following));
		});
	}

	getFollowingOnly(){
		return WrapFollow.call(this).then(function(users){
			return Promise.resolve(LoDash.difference(users.following, users.followers));
		});
	}
};
