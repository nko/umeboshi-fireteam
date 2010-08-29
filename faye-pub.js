var Faye   = require('faye')
var client = new Faye.Client('http://localhost:8000/faye');

client.publish('/messages', {
  text: 'Hello world'
});