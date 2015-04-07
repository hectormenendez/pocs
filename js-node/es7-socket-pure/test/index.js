'use strict';

const TinySocket = require('../build/index');

describe('TinySocket\'s server', function(){

	it('should return a promise', function(done){
		let server = new TinySocket.Server();
		expect(server.constructor).to.equal(Promise);
		server.then(function(res, err){
			if (err) throw err;
			res.close();
			done();
		}).catch(function(err){
			done(err);
		});
	});

	it('should not allow to creare more than one server listening to the same port', function(done){
		let server;
		(new TinySocket.Server()).then(function(res, err){
			if (err) throw err;
			server = res;
			return new TinySocket.Server();
		}).then(function(res, err){
			if (err) throw err;
		}).catch(function(err){
			server.close();
			expect(err.constructor).to.equal(Error);
			done();
		});
	});

	it('should have a onOpen setter for a callback when a connection opens.', function(done){

		let runner  = function(){
			let server = new TinySocket.Server();
			server.then(function(res, err){
				if (err) throw err;
				server = res;
				server.onOpen = function(){
					server.close();
					done();
				};
				return new TinySocket.Client(); // opens the connection
			}).catch(function(err){
				server.close();
				done(err);
			});
		};
		expect(runner).to.not.throw(Error);
	});

	it('should have an onData setter for a callback when a message arrives.', function(done){

		let runner = function(){
			let server = new TinySocket.Server();

			server.then(function(res, err){
				if (err) throw err;
				server = res;
				server.onData = function(data){
					server.close();
					expect(data.constructor).to.equal(Object);
					expect(data.foo).to.equal('bar');
					done();
				};
				return new TinySocket.Client();
			}).then(function(client, err){
				if (err) throw err;
				client.send({foo:'bar'});
			}).catch(function(err){
				server.close();
				done(err);
			});
		};

		expect(runner).to.not.throw(Error);
	});

});