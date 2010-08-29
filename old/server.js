//libraries
var  http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,sys = require('sys')
    ,io = require('./lib/socket.io-node/lib/socket.io');

//global variables
var  hosted_on_joyent = /\/home\/node\/node\-service\/releases\/[^\/]*\/server.js/.test(__filename)
    ,WEBSERVER_PORT = hosted_on_joyent ? 80 : 8080
    ,CHANNEL_STARTING_PORT = 8081
    ,BLURB_SIZE = hosted_on_joyent ? 7 : 1
    ,BLURB_CHARS = "abcdefghijklmnopqrstuvxywz"    
    ,channels = {}
    ,url_mapping = [
       {'url': /^(\/channel\/new\/?)(\.json)?$/, 'view': newChannel}
      ,{'url': /^(\/[a-z]+\/?)(\.json)?$/, 'view': joinChannel}
      ,{'url': /.*/, 'view': defaultView}
    ];

console.log(__filename);
console.log(WEBSERVER_PORT);

var webserver = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  console.log('WebServer was requested to provide ', path)
  for (i=0;i<url_mapping.length;i++){
    var map = url_mapping[i];
    if (map.url.test(path)){
      map.view(req, res, path, map.url);
      break;
    }
  }
});

webserver.listen(WEBSERVER_PORT);

//views
function newChannel(req, res, path, pattern){
	console.log(baseURL(req))
  var blurb = generateBlurb();
  channels[blurb] = new Channel(CHANNEL_STARTING_PORT++);
	console.log("New Channel: "+blurb);
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("your blurb is "+blurb);
  return;
}

function joinChannel(req, res, path, pattern){
	
  console.log('Join Channel: %s', path)
  var blurb = pattern.exec(path)[1].replace('/', '')
  console.log(blurb)
  var channelPort = channels[blurb].port
	console.log(baseURL(req))
	res.writeHead(302, {
		'Location':'http://'+baseURL(req)+':'+channelPort+'/chat.html'
	});
	res.end();
}

function defaultView(req, res, path, pattern){
	console.log(baseURL(req))  
  path = (path == '/') ? '/templates/index.html' : '/lib/socket.io-node/example' + path;
  if (/\.(js|html|swf|ico|png)$/.test(path)){
    try {
      var swf = path.substr(-4) === '.swf';
      res.writeHead(200, {'Content-Type': swf ? 'application/x-shockwave-flash' : ('text/' + (path.substr(-3) === '.js' ? 'javascript' : 'html'))});
      fs.readFile(__dirname + path, swf ? 'binary' : 'utf8', function(err, data){
        if (!err) res.write(data, swf ? 'binary' : 'utf8');
        res.end();
      });
      return true;
   } catch(e){ 
     send404(res); 
     return false;
   }
 }
 send404(res);
 return false;
}

function generateBlurb(){
  var blurb = '';
  for (i=0;i<BLURB_SIZE;i++){
    blurb += BLURB_CHARS[Math.floor(Math.random()*BLURB_CHARS.length)]
  }
  return blurb;
}

baseURL = function(req) {
	return req.headers['host'].split(":")[0];
}

Channel = function(port) {
	this.port = port;
	server = createChannel();
	server.listen(port);
	bindEventHandlers(server);
	
	function createChannel() {
		return http.createServer(function(req, res){
		  var path = url.parse(req.url).pathname;
			try {
				path = '/lib/socket.io-node/example' + path
				res.writeHead(200, {'Content-Type': 'text/html'});
				fs.readFile(__dirname + path, 'utf8', function(err, data){
					if (!err) res.write(data, 'utf8');
					res.end();
				});
			} catch(e){ 
				send404(res); 
			}
		});
	}

	function bindEventHandlers(server) {
		var socketIO = require('./lib/socket.io-node/lib/socket.io');
		var io = socketIO.listen(server),
		    buffer = [];

		io.on('connection', function(client){
		  client.send({ buffer: buffer });
		  client.broadcast({ announcement: client.sessionId + ' connected' });

		  client.on('message', function(message){
		    var msg = { message: [client.sessionId, message] };
		    buffer.push(msg);
		    if (buffer.length > 15) buffer.shift();
		    client.broadcast(msg);
		  });

		  client.on('disconnect', function(){
		    client.broadcast({ announcement: client.sessionId + ' disconnected' });
		  });
		});
	}
	
	send404 = function(res){
	  res.writeHead(404);
	  res.write('404');
	  res.end();
	}
}
