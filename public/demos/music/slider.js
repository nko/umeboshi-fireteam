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
    ,http_server_url = 'http://'+domain_name
    ,pubsub_server_url = 'http://umeboshi-fireteam.no.de:8000';

function init(){
  	console.log(domain_name)
	var querystring = window.location.search
	//var debug_element = document.getElementById('debug-area')
	channel_key = querystring.substring(querystring.indexOf('channel=')+'channel='.length, querystring.length)
	pubsub_client = new Faye.Client(pubsub_server_url+'/pubsubhub', {
	      timeout: 120
	  });
	console.log('init')
	//document.getElementById('testlink').addEventListener('click', pubTest, false)
	  
}


function pub(obj) {
  pubsub_client.publish('/'+channel_key, obj);
}

function pubTest(posNumber,posOwner){
  console.log('pubTest')
	//e.preventDefault();
  console.log(pubsub_client)
  var my_obj = {
     'position': posNumber
    ,'owner': posOwner
    // ,'jsEvent': this
  }
  console.log(my_obj)
  pub(my_obj);
}

