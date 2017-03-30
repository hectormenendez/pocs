const messages = require('./messages');
const Users = require('./users');

module.exports = function() {
  const App = this;
  App.configure(Users);
  App.configure(messages);
};
