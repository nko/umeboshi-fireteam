var  http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,sys = require('sys');

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

Channel.prototype.port = 0;

channel = new Channel(8080);
console.log("Channel started at port "+channel.port);
