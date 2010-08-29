function playPauseVideo(){
  var video_element = document.getElementById('main-video')
  if (video_element.paused){
    video_element.play();
  } else{
    video_element.pause();
  }
}
