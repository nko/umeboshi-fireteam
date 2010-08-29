var Faye   = require('faye')

var client = new Faye.Client('http://localhost:8000/faye');

client.subscribe('/messages', function(message) {
  console.log('Got a message: ' + message.text);
});