var Faye   = require('./lib/faye-0.5.2/faye-node.js')
var client = new Faye.Client('http://localhost:8000/pubsubhub');

client.publish('/messages', {
  text: 'Hello world'
});
