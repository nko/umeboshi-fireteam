var  http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,sys = require('sys')
    ,io = require('./lib/socket.io-node/lib/socket.io');
    
var webserver = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" })
  res.end('\
<p>Umeboshi Fireteam FTW</p>\
<a href="#">testing…</a>\
');
});

webserver.listen(80);