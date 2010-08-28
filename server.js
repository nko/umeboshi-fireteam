//libraries
var  http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,sys = require('sys')
    ,io = require('./lib/socket.io-node/lib/socket.io');

//constants
var  BLURB_SIZE = 7
    ,BLURB_CHARS = "abcdefghijklmnopqrstuvxywz"

//global variables
var  hosted_on_joyent = /\/home\/node\/node\-service\/releases\/[^\/]*\/server.js/.test(__filename)
    ,WEBSERVER_PORT = hosted_on_joyent ? 80:8082
    ,channels = {}
    ,url_mapping = [
       {'url': /^(\/channel\/new\/?)(\.json)?$/, 'view': newChannel}
      ,{'url': /.*/, 'view': defaultView}
    ];

console.log(__filename);
console.log(WEBSERVER_PORT);

var webserver = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  for (i=0;i<url_mapping.length;i++){
    var map = url_mapping[i];
    if (map.url.test(path)){
      map.view(res, path, map.url);
      break;
    }
  }
});

webserver.listen(WEBSERVER_PORT);

//views
function newChannel(res, path, pattern){
  var fmt = (pattern.exec(path)[2])?pattern.exec(path)[2]:'txt';
  var blurb = generateBlurb();
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

function defaultView(res, path, pattern){
  path = (path == '/') ? '/index.html' : path;
  path = '/templates' + path
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

function createSocketServer(blurb){
  // // socket.io, I choose you
  // var socket = io.listen(server);
  // 
  // socket.on('connection', function(client){
  //   // new client is here!
  //   client.on('message', function(){ … })
  //   client.on('disconnect', function(){ … })
  // });
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
