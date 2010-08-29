var http = require('http'),
    faye = require('./lib/faye-0.5.2/faye-node.js');

server = new Faye.NodeAdapter({mount: '/pubsubhub'});
server.listen(8000);

console.log("PubSubHub running at 8000")

