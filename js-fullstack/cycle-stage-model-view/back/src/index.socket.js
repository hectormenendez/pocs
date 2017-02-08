const SocketIO = require('feathers-socketio');

module.exports = SocketIO({
    path     : '/ws/',
    wsEngine : 'uws', // Use the uWebSocket (uws) module for better performance
});
