var Faye   = require('./lib/faye-0.5.2/faye-node.js')

var client = new Faye.Client('http://localhost:8000/faye');

client.subscribe('/messages', function(message) {
  console.log('Got a message: ' + message.text);
});