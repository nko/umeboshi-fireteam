//testing Joyent, this is just a copy/paste of http://nodeknockout.posterous.com/countdown-to-knockout-post-11-deploying-to-jo
var http = require('http');
 
var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Hello world\n");
});
 
server.listen(80);