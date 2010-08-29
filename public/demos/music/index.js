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
    ,pubsub_server_url = 'http://'+domain_name+':8000'
    ,http_server_url = 'http://'+domain_name + ((domain_name.indexOf('no.de')==-1)?(':8080'):(''));

function init(){
  console.log('init')
  console.log(domain_name)
  document.getElementById('testlink').addEventListener('click', pubTest, false)
  pubsub_client = new Faye.Client(pubsub_server_url+'/pubsubhub', {
      timeout: 120
  });
}


function channelReady(channel){
  channel_key = channel.channel_key;
  console.log('we have a channel, its name is: '+channel.channel_key);  
  document.getElementById('blurp').innerHTML = channel_key;
}
