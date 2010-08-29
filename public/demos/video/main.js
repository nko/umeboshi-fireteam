var  channel_key
    ,pubsub_client
    ,pubsub_server_url = 'umeboshi-fireteam.no.de:8000'
    ,http_server_url = 'umeboshi-fireteam.no.de:8080';

function init(){
  console.log('init')
  document.getElementById('testlink').addEventListener('click', pubTest, false)
  pubsub_client = new Faye.Client('http://'+pubsub_server_url+'/pubsubhub', {
      timeout: 120
  });
}


function channelReady(channel){
  channel_key = channel.channel_key;
  console.log('we have a channel, its name is: '+channel.channel_key);  
  document.getElementById('playback-control-url-field').value = 'http://'+http_server_url+'/demos/video/controls.html?channel='+channel_key;
}

function pub(obj) {
  pubsub_client.publish('/'+channel_key, obj);
}

function pubTest(e){
  console.log('pubTest')
	e.preventDefault();
  console.log(pubsub_client)
  var my_obj = {
     'text': 'Hello World'
    // ,'htmlElement': e.target
    // ,'jsEvent': this
  }
  console.log(my_obj)
  pub(my_obj);
}


function playPauseVideo(){
  var video_element = document.getElementById('main-video')
  if (video_element.paused){
    video_element.play();
  } else{
    video_element.pause();
  }
}
