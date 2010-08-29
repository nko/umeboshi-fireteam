var  http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,sys = require('sys')


var webserver = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
	fs.readFile(__dirname + "/templates/publisher.html", 'utf8', function(err, data){
		if (!err) res.write(data, 'utf8');
		res.end();
	});
});

webserver.listen(8080);