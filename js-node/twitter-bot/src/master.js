'use strict';

const Cluster = require('cluster');
const Path    = require('path');

const Chalk    = require('chalk');

const Bot  = require('./lib/bot');
const Keys = require('./lib/keys');
const DB   = require('./lib/db');

const ConfBot  = require('../.conf/bot.json');
const ConfKeys = require('../.conf/keys.json');

const WORKERS = require('os').cpus().length;

// // creates one bot per account
// let bot = {};
// for (let cfg of ConfBot) bot[cfg.name] = new Bot(cfg);

// let keys = new Keys(ConfKeys);
// let Tasks = ['listen'];


// if (!Cluster.isMaster)
// 	require('./' + process.env.taskname);

// else {

// 	(async function(){

// 		let server;
// 		try { server = await new Conn.Server(); } catch (err){ throw new Error(err); }

// 		server.onData = function(data){
// 			console.info('server » data »', data);

// 			server.send({test:'hello back'});
// 		};

// 		server.onOpen = function(){
// 			console.info('connection established');
// 		};

// 		let client;
// 		try { client = await new Conn.Client(); } catch (err){ throw new Error(err); }

// 		client.onData = function(data){
// 			console.info('client » data »', data);
// 		};

// 		client.send({test:'hello world'});

// 	})();

// }



// 	// let db     = await new DB();
// 	// let result = await db.findOne('tweeple', {handle:'hectormenendez'});
// for (let usr in User){

// 	User[usr].bot = new Bot(User[usr].conf.oauth);

// 	for (let wrd of ['keywords','blacklist']){
// 		let keys = User[usr].conf[wrd].join('|');
// 		let name = wrd[0].toUpperCase() + wrd.slice(1);
// 		User[usr]['txt' + name] = new RegExp(rxText.replace('%W%', keys), 'gi');
// 		User[usr]['usr' + name] = new RegExp(rxUser.replace('%W%', keys), 'gi');
// 	}
// }

// async function TransitionUnfollows(){
// 	let tweple = await User.etor.bot.getFollowingOnly();
// 	for (let usr of tweple){
// 		usr = await User.etor.bot.getUser(usr);
// 		await User.etor.bot.unfollow(usr.id);
// 		await User.hmenendez.bot.follow(usr.id);
// 		console.info(Chalk.red('transitioned »'), ' @', usr.screen_name);
// 	}
// }

// let stream = User.etor.bot.listen(User.etor.conf.keywords);
// stream.on('tweet', function(tweet){

// 	let lang = tweet.lang.toUpperCase();
// 	let text = tweet.text.toLowerCase();

// 	// Only spanish and english
// 	if (lang !== 'ES' && lang !== 'EN') return false;

// 	// Not mentions
// 	if (tweet.text.match(/\@[a-z0-9_]+/gi)) return false;

// 	// Original content only
// 	if (tweet.retweeted_status || tweet.text.match(/\bRT\b/gi)) return false;

// 	// No blacklisted words in either the tweet or user name
// 	if (
// 		text.match(User.etor.txtBlacklist)                   ||
// 		tweet.user.screen_name.match(User.etor.usrBlacklist) ||
// 		tweet.user.name.match(User.etor.usrBlacklist)
// 	) return false;

// 	// keyword matching on tweet only
// 	let matches = text.match(User.etor.txtKeywords);
// 	if (!matches) return false;
// 	matches = matches
// 		.map(v => v.trim())
// 		.filter((v, i, self)=> self.indexOf(v) === i);
// 	if (matches.length < 2) return false;

// 	// Disregarding non popular tweple. (Also a dumb way of avoiding bots)
// 	tweet.user.ratio = tweet.user.followers_count / tweet.user.friends_count;
// 	if (tweet.user.ratio < 0.66 || tweet.user.followers_count < 100) return false;

// 	console.info(
// 		Chalk.green(new Date()),
// 		Chalk.gray(lang),
// 		Chalk.yellow(`[${matches.join('|')}]`),
// 		Chalk.cyan(`@${tweet.user.screen_name}`),
// 		tweet.text
// 	);
// });
