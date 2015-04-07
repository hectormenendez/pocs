'use strict';

const Net = require('net');

const PORT     = process.env.PORT || 7777;
const ENCODING = process.env.ENCODING || 'utf-8';

const Private = {
	server  : new WeakMap(),
	socket  : new WeakMap(),
	onData  : new WeakMap(),
	onOpen  : new WeakMap(),
	onClose : new WeakMap(),

	fnCaller: function(){
		let args   = Array.prototype.slice.call(arguments);
		let type   = args.shift();
		let onType = `on${type[0].toUpperCase() + type.slice(1)}`;
		let cback  = Private[onType].get(this);
		if (typeof cback !== 'function') return false;
		return cback.apply(this, args);
	},

	fnData: function(data){
		try {
			data = JSON.parse(data.toString(ENCODING));
		} catch (e) {
			data = data.toString(ENCODING);
		}
		return Private.fnCaller.call(this, 'data', data);
	},

	fnClose: function(){
		Private.socket.set(this, null);
		return Private.fnCaller.call(this, 'close');
	},

	fnSend: function(){
		let socket = Private.socket.get(this);
		if (!socket) throw new Error('The connection is not available');
		return socket.write(JSON.stringify(arguments[0]));
	}
};

module.exports = {

	Server: class {

		constructor(options={}){
			let self = this;
			return new Promise(function(resolve, reject){
				let server = Net.createServer(options);
				Private.server.set(self, server);
				server.on('error', function(err){ reject(err); });
				server.on('close', Private.fnClose.bind(self));
				server.on('connection', function(socket){
					Private.socket.set(self, socket);
					socket.on('data', Private.fnData.bind(self));
					return Private.fnCaller.call(self, 'open');
				});
				server.listen(PORT, function(){
					resolve(self);
				});
			});
		}

		send(){
			return Private.fnSend.apply(this, arguments);
		}

		close(){
			let server = Private.server.get(this);
			server.close();
		}

		set onOpen(callback){
			return Private.onOpen.set(this, callback);
		}

		set onData(callback){
			return Private.onData.set(this, callback);
		}

		set onClose(callback){
			return Private.onClose.set(this, callback);
		}
	},

	Client: class {

		constructor(options={}){
			let self = this;
			return new Promise(function(resolve, reject){
				let socket = Net.Socket(options);
				Private.socket.set(self, socket);
				socket.on('error', function(err){ reject(err); });
				socket.on('close', Private.fnClose.bind(self));
				socket.connect(PORT, function(){
					socket.on('data', Private.fnData.bind(self));
					resolve(self);
				});
			});
		}

		send(){
			return Private.fnSend.apply(this, arguments);
		}

		close(){
			let socket = Private.socket.get(this);
			if (!socket) throw new Error('The connection is not available');
			return socket.destroy();
		}

		set onData(callback){
			return Private.onData.set(this, callback);
		}

		set onClose(callback){
			return Private.onClose.set(this, callback);
		}

	}
};