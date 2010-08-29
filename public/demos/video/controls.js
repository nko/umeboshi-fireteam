var  channel_key
    ,pubsub_client
    ,pubsub_server_url = '192.168.1.102:8000'
    ,http_server_url = '192.168.1.102:8080';

function init(){
  var querystring = window.location.search
  var debug_element = document.getElementById('debug-area')
  channel_key = querystring.substring(querystring.indexOf('channel=')+'channel='.length, querystring.length)
  debug_element.value = channel_key
  pubsub_client = new Faye.Client('http://'+pubsub_server_url+'/pubsubhub', {
      timeout: 120
  });
  pubsub_client.subscribe('/'+channel_key, function(message) {
    alert('Got a message: ' + message.text);
  });
}
// 
// var Faye   = require('./lib/faye-0.5.2/faye-node.js')
// 
// var client = new Faye.Client('http://localhost:8000/pubsubhub');
// 
// 
// client.subscribe('/l', function(message) {
//   console.log('Got a message: ' + message.text);
// });
// 
// console.log("Listening to /l")