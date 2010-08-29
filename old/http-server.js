var  http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,sys = require('sys')

Utils = function() {
	this.baseUrl = function(req) {
		return req.headers['host'].split(":")[0];
	}
	this.generateBlurb = function() {
		var blurb = '';
	  for (i=0;i<BLURB_SIZE;i++){
	    blurb += BLURB_CHARS[Math.floor(Math.random()*BLURB_CHARS.length)]
	  }
	  return blurb;
	}
}
utils = new Utils();

var  HOSTED_ON_JOYENT = /\/home\/node\/node\-service\/releases\/[^\/]*\/server.js/.test(__filename)
    ,WEBSERVER_PORT = HOSTED_ON_JOYENT ? 80 : 8080
    ,CHANNEL_STARTING_PORT = 8081
    ,BLURB_SIZE = HOSTED_ON_JOYENT ? 7 : 1
    ,BLURB_CHARS = "abcdefghijklmnopqrstuvxywz"    
    ,channels = {}
    ,url_mapping = [
       {'url': /^(\/channel\/new\/?)(\.json)?$/, 'view': newChannel}
			,{'url': /^(\/channel\/info\/[a-z]+?)(\.json)?$/, 'view': channelInfo}
			,{'url': /^(\/channels?)(\.json)?$/, 'view': listChannels}
      // ,{'url': /^(\/[a-z]+\/?)(\.json)?$/, 'view': joinChannel}
      ,{'url': /.*/, 'view': home}
    ];


var webserver = http.createServer(function (req, res) {
	var path = url.parse(req.url).pathname;
  for (i=0;i<url_mapping.length;i++){
    var map = url_mapping[i];
    if (map.url.test(path)){
      map.view(req, res, path, map.url);
      break;
    }
  }
});
webserver.listen(8080);
console.log("HTTP running at 8080");


function newChannel(req, res, path, pattern){
	var baseURL = utils.baseUrl(req);
  var blurb = utils.generateBlurb();
	var channelURL = "http://"+baseURL+":8000/pubsubhub/"+blurb;
	channels[blurb] = channelURL;
	res.writeHead(200, { "Content-Type": "text/html" })
  res.end("Your widget must subscribe to the following channel: "+channelURL);
  return;
}

function channelInfo(req, res, path, pattern) {
	tokens = path.split("/");
	var blurb = tokens[tokens.length-1];
	res.writeHead(200, { "Content-Type": "text/html" })
	res.end(channels[blurb]);
	return;
}

function listChannels(req, res, path, pattern){
	var rsp = "";
	for (var i in channels){
		rsp += "<li>"+channels[i]+"</li>";
	}
	res.writeHead(200, { "Content-Type": "text/html" })
  res.end(rsp);
}

function home(req, res, path, pattern){
  path = '/templates/index.html';
	try {
	  res.writeHead(200, {'Content-Type': 'text/html'});
	  fs.readFile(__dirname + path, 'utf8', function(err, data){
	    if (!err) res.write(data, 'utf8');
	    res.end();
	  });
	  return true;
	} catch(e){ 
	 send404(res); 
	 return false;
	}
}

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
}
