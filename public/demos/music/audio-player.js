//For people without firebug
if (!console) {
  var console = {}
  console.log = function(text){
    return
  }
}

var  channel_key
    ,pubsub_client
    ,domain_name =  window.location.hostname
    ,pubsub_server_url = 'http://umeboshi-fireteam.no.de:8000';

function init(){
  console.log(domain_name)
  var querystring = window.location.search
  //var debug_element = document.getElementById('debug-area')
  channel_key = querystring.substring(querystring.indexOf('channel=')+'channel='.length, querystring.length)
  console.log(channel_key);
  pubsub_client = new Faye.Client(pubsub_server_url+'/pubsubhub', {
      timeout: 120
  });
  pubsub_client.subscribe('/'+channel_key, function(message) {
    console.log('Got a message: ' + message.position + message.owner );
	valor = 1-(message.position/550);
	console.log('valor'+valor);
	changeVolume(message.owner,valor);
  });
}
