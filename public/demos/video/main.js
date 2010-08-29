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
    ,http_server_url = 'http://'+domain_name + ((domain_name.indexOf('no.de')==-1)?(':8080'):(''))
    ,video_element
    ,video_progress_bar
    ,video_location_bar
    ,playpausebtn
    ,playpausebtn_play_img
    

function init(){
  console.log('init')
  console.log(domain_name)
  video_element = document.getElementById('main-video'); 
  video_progress_bar = document.getElementById('loaded-bar')
  video_location_bar = document.getElementById('played-bar')
  playpausebtn = document.getElementById('play-button')
  playpausebtn_play_img = document.getElementById('play-image')
  pubsub_client = new Faye.Client(pubsub_server_url+'/pubsubhub', {
      timeout: 120
  });
  video_element.addEventListener('progress', updateLoadingBar, false);
  video_element.addEventListener('timeupdate', updateTimeBar, false);
  playpausebtn.addEventListener('click', playPauseVideo, false)
}


function channelReady(channel){
  channel_key = channel.channel_key;
  console.log('we have a channel, its name is: '+channel.channel_key);  
  document.getElementById('playback-control-url-field').value = http_server_url+'/demos/video/controls.html?channel='+channel_key;
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

function updateLoadingBar(e){
  video_progress_bar.style.width = ((e.loaded/e.total)*100)+'%';
}
function updateTimeBar(e){
  console.log(e.target.currentTime+' / '+e.target.duration)
  video_location_bar.style.width = ((e.target.currentTime/e.target.duration)*100)+'%';
}
function playPauseVideo(){
  if (video_element.paused){
    video_element.play();
    playpausebtn_play_img.style.display = 'none'
  } else{
    video_element.pause();
    playpausebtn_play_img.style.display = 'block'
  }
}
