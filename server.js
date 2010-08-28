var  http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,sys = require('sys')
    ,io = require('./lib/socket.io-node/lib/socket.io');
    
var  hosted_on_joyent = /\/home\/node\/node\-service\/releases\/[^\/]*\/server.js/.test(__filename)
    ,WEBSERVER_PORT = hosted_on_joyent ? '80':'8082';

console.log(__filename);
console.log(WEBSERVER_PORT);

var webserver = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  path = (path == '/')?'/index.html':path;
  path = '/templates' + path
  if (/\.(js|html|swf)$/.test(path)){
    try {
      var swf = path.substr(-4) === '.swf';
      res.writeHead(200, {'Content-Type': swf ? 'application/x-shockwave-flash' : ('text/' + (path.substr(-3) === '.js' ? 'javascript' : 'html'))});
      fs.readFile(__dirname + path, swf ? 'binary' : 'utf8', function(err, data){
        if (!err) res.write(data, swf ? 'binary' : 'utf8');
        res.end();
      });
    } catch(e){ 
      send404(res); 
    }
    return true;
  }
  send404(res);
  return false;
  // res.writeHead(200, { "Content-Type": "text/plain" })
  // res.end("Hello world\n");
});

webserver.listen(WEBSERVER_PORT);


// helpers
function send404(res){
  res.writeHead(404);
  res.write('404');
  res.end();
}
