var  http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,sys = require('sys')
    ,io = require('./lib/socket.io-node/lib/socket.io');
    
var  hosted_on_joyent = /\/home\/node\/node\-service\/releases\/[^\/]*\/server.js/.test(__filename)
    ,WEBSERVER_PORT = hosted_on_joyent ? 80:8082
    ,url_mapping = [
       {'url': /^(\/channel\/new\/?)$/, 'view': newChannel}
      ,{'url': /.*/, 'view': defaultView}
    ];

console.log(__filename);
console.log(WEBSERVER_PORT);

var webserver = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  console.log('path=%s', path);
  url_mapping.forEach(function(map){
    if (map.url.test(path)){
      map.view(res, path);
    }
  });
});

webserver.listen(WEBSERVER_PORT);

//views
function newChannel(res, path){
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("some useful stuff in here please.\n");    
  return true;
}

function defaultView(res, path){
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


// helpers
function send404(res){
  console.log('not found');
  res.writeHead(404);
  res.write('404');
  res.end();
}
