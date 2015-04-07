# tiny-socket

A tiny wrapper for Node's sockets, written in ES7.

### Usage

The most convenient way of using this module is with ES7's async/await.

```JavaScript

	(async function(){

		let server;
		try { server = await new Conn.Server(); } catch (err){ throw new Error(err); }

		server.onData = function(data){
			console.info('server » data »', data);
			server.send({test:'hello back'});
			server.close();
		};
		server.onOpen = function(){
			console.info('server » client opened connection');
		};
		server.onClose = function(){
			console.info('server » connection closed')
		}

		let client;
		try { client = await new Conn.Client(); } catch (err){ throw new Error(err); }

		client.onData = function(data){
			console.info('client » data »', data);
		};

		client.send({test:'hello world'});

	})();

```

But if you don't feel comfortable using this syntax, you can use regular promises

```JavaScript

	let TinySocket = require('tiny-socket');

	(new TinySocket.Server()).then(function(server, err){
		if (err) throw err;
		server.onData = function(data){
			console.info('server » data »', data);
			server.send({test:'hello back'});
			server.close();
		};
		server.onOpen = function(){
			console.info('server » client opened connection');
		};
		server.onClose = function(){
			console.info('server » connection closed')
		}
		return new TinySocket.Client();
	}).then(function(client, err){
		if (err) throw err;
		client.onData = function(data){
			console.info('client » data »', data);
		};
		client.send({test:'hello world'});
	}).catch(function(err){
		server.close();
		throw err;
	});

```