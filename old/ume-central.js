//libraries
var  http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,sys = require('sys')
    ,querystring = require('querystring')
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
       ,{'url': /.*/, 'view': defaultView}
    ];
    
var webserver = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  console.log(url.parse(req.url))
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
  var params = querystring.parse(url.parse(req.url).query)
  var fmt = (pattern.exec(path)[2])?pattern.exec(path)[2]:'txt';
  var blurb = generateBlurb();
	console.log("New Channel: "+blurb);
  switch(fmt){
    case '.json':
      // res.writeHead(200, { "Content-Type": "application/json" })
      res.writeHead(200, { "Content-Type": "text/plain" })
      var output = JSON.stringify({ 'channel_key': blurb });
      if (params.callback) output = params.callback + '('+output+')';//JSONP
      res.end(output);
      break;
    case '.txt':
    default:
      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end("your blurb is "+blurb);
      break;
  }
  return;
}

function defaultView(req, res, path, pattern){
  console.log('defaultView')
  if (/\.(js|html|css|swf|ico|png)$/i.test(path)){
    try {
      var mime_types = {
         'swf': 'application/x-shockwave-flash'
        ,'js': 'text/javascript'
        ,'css': 'text/css'
        ,'html': 'text/html'
        ,'ico': 'image/x-icon'
        ,'png':'image/png'
      }
      var extension = path.substring(path.lastIndexOf('.')+1, path.length)
      var mime = mime_types[extension]
      res.writeHead(200, {'Content-Type': mime });
      console.log(mime)
      var encoding = (mime.substring(0, 4) != 'text') ? 'binary' : 'utf8';
      console.log(encoding)
    	console.log('Opening '+__dirname + path)
      fs.readFile(__dirname + path, encoding, function(err, data){
        if (!err) res.write(data, encoding);
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

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
}
