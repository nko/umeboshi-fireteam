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
    ,debug_element
    ,video_progress_bar
    ,video_location_bar
    ,playpausebtn
    ,playpausebtn_play_img

function init(){
  var querystring = window.location.search
  debug_element = document.getElementById('debug-area')
  video_progress_bar = document.getElementById('loaded-bar')
  video_location_bar = document.getElementById('played-bar')
  playpausebtn = document.getElementById('play-button')
  playpausebtn_play_img = document.getElementById('play-image')
  playpausebtn.addEventListener('click', playPauseVideo, false)
  channel_key = querystring.substring(querystring.indexOf('channel=')+'channel='.length, querystring.length)
  debugLog('Connected on channel:'+channel_key);
  pubsub_client = new Faye.Client(pubsub_server_url+'/pubsubhub', {
      timeout: 120
  });
  pub({'event':'controls_client_connected'})
  pubsub_client.subscribe('/'+channel_key, function(message) {
    switch(message.event){
      case 'progress':
        updateLoadingBar({'loaded':message.loaded, 'total':message.total})
        break;
      case 'timeupdate':
        updateTimeBar({'currentTime':message.currentTime, 'duration':message.duration})
        break;
      default:
        break;
    }
  });
}

function pub(obj) {
  pubsub_client.publish('/'+channel_key, obj);
}

function updateLoadingBar(e){
  video_progress_bar.style.width = ((e.loaded/e.total)*100)+'%';
}
function updateTimeBar(e){
  debugLog(JSON.stringify(e))
  video_location_bar.style.width = ((e.currentTime/e.duration)*100)+'%';
}

function debugLog(msg){
  debug_element.value += msg+'\n';
}

function playPauseVideo(){
  if (playpausebtn_play_img.style.display == 'block'){
    playpausebtn_play_img.style.display = 'none'
    debugLog('play')
  } else{
    playpausebtn_play_img.style.display = 'block'
    debugLog('pause')
  }
  pub({
     'event': 'click'
    ,'dispatcher': 'playpausebtn'
  });
}
