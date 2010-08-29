var Faye   = require('./lib/faye-0.5.2/faye-node.js')

var client = new Faye.Client('http://localhost:8000/pubsubhub');


client.subscribe('/l', function(message) {
  console.log('Got a message: ' + message.text);
});

console.log("Listening to /l")