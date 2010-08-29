var http = require('http'),
    faye = require('faye');

server = new Faye.NodeAdapter({mount: '/faye'});
server.listen(8000);

