//libraries
var  http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,sys = require('sys')
    ,io = require('./lib/socket.io-node/lib/socket.io');

//global variables
var  hosted_on_joyent = /\/home\/node\/node\-service\/releases\/[^\/]*\/server.js/.test(__filename)
    ,WEBSERVER_PORT = hosted_on_joyent ? 80 : 8082
    ,SOCKET_SERVER_PORT = 8080
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
  console.log('path 2: %s', path)
  for (i=0;i<url_mapping.length;i++){
    var map = url_mapping[i];
    if (map.url.test(path)){
      map.view(res, path, map.url);
      break;
    }
  }
});

webserver.listen(WEBSERVER_PORT);

var socket_server = http.createServer(function (req, res) {
  console.log(res);
  }
);
buffer = [];

socket_server.listen(SOCKET_SERVER_PORT);

//views
function newChannel(res, path, pattern){
  var fmt = (pattern.exec(path)[2])?pattern.exec(path)[2]:'txt';
  var blurb = generateBlurb();
  createChannel(blurb)
  switch(fmt){
    case '.json':
      console.log('JSON TBD')
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end('');
      break;
    case '.txt':
    default:
      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end("your blurb is "+blurb);
      break;
  }
  return true;
}

function joinChannel(res, path, pattern){
  console.log('path 3: %s', path)
  
  var fmt = (pattern.exec(path)[2])?pattern.exec(path)[2]:'txt';
  var blurb = pattern.exec(path)[1].replace('/', '')
  console.log(blurb)
  var path = '/chat.html'
  if (channels[blurb]) {
    switch(fmt){
      case '.json':
        break;
      case '.txt':
      default:
        defaultView(res, path, pattern);
        break;
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("blurb not found");
    return false;
  }
}

function defaultView(res, path, pattern){
  console.log('default view')
  console.log('path 4: %s', path)
  
  path = (path == '/') ? '/templates/index.html' : '/lib/socket.io-node/example' + path;
  console.log('path 5: %s', path)
  if (/\.(js|html|swf|ico|png)$/.test(path)){
    console.log('path 6: %s', path)
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

function createChannel(blurb){
  channels[blurb] = io.listen(socket_server);
  
  channels[blurb].on('connection', function(client){
    client.send({ buffer: buffer });
    client.broadcast({ announcement: client.sessionId + ' connected' });
    
    // new client is here!
    client.on('message', function(message){ 
      console.log('message from %s', client.sessionId)
      var msg = { message: [client.sessionId, message] };
  		buffer.push(msg);
  		if (buffer.length > 15) buffer.shift();
  		client.broadcast(msg);
    });
    client.on('disconnect', function(){ 
      console.log('%s disconnected', client.sessionId)
    });
    // client.broadcast({ announcement: client.sessionId + ' connected' });
  });
}

function generateBlurb(){
  var blurb = '';
  for (i=0;i<BLURB_SIZE;i++){
    blurb += BLURB_CHARS[Math.floor(Math.random()*BLURB_CHARS.length)]
  }
  return blurb;
}

// helpers
 
function send404(res){
  console.log('not found');
  res.writeHead(404);
  res.write('404');
  res.end();
}
