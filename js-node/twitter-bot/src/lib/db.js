'use strict';

const Mongo = require('mongodb').MongoClient;

const DB = new WeakMap();

module.exports = class {

	constructor(){
		let self = this;
		return new Promise(function(resolve, reject){
			Mongo.connect('mongodb://localhost/twitterbot', function(err, db){
				if (err) return reject(err);
				DB.set(self, db);
				resolve(self);
			});
		});
	}

	findOne(collection, opt){
		let db = DB.get(this);
		return new Promise(function(resolve, reject){
			collection = db.collection(collection);
			collection.findOne(opt, function(err, res){
				if (err) return reject(err);
				return resolve(res);
			});
		});
	}

};