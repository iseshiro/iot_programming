const http = require('http');
const server = http.createServer();
server.on('request', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<!DOCTYPE html><html><body><h1>Hello World !</h1></body></html>');
    res.end();
});
console.log('Server running at http://localhost/');
server.listen(80);
