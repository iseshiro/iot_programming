const server = require('http').createServer();
const io = require('socket.io').listen(server);
const fs = require('fs');
var path = require('path');
const exec = require('child_process').exec;
const template = fs.readFileSync(__dirname + '/index.html', 'utf-8');
var led_val = 0xF;
var slide_sw_val = 0;
var button_sw_val = 0;

var mime = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript'
};

var message = {
    200: 'OK',
    404: 'Not Found',
    500: 'Internal Server Error',
    501: 'Note Implemented'
};

//
// send error status
//
function sendError(req, res, statusCode) {
    res.writeHead(statusCode, {'Content-Type': 'text/html'});
    res.write('<!DOCTYPE html><html><body><h1>' + message[statusCode] + '</h1></body></html>');
    res.end();
    console.log('<- ' + message[statusCode] + ': ' + req.method + ' ' + req.url);
}

function renderForm(req, res) {
    if (req.url == '/') {
	const data = template;
	//console.log('renderForm1 : ' + req.url);
	res.writeHead(200, {'Content-Type' : 'text/html'});
	res.write(data);
	res.end();
    } else if (req.url.indexOf('/socket.io/') != 0 ) {
	//console.log('renderForm2 : ' + req.url);
	filePath = req.url;
	var fullPath = __dirname + filePath;
	fs.readFile(fullPath, function(err, data) {
	    if (err) {
		req.method = fullPath;
		sendError(req, res, 404);
	    } else {
		res.writeHead(200, {'Content-Type': mime[path.extname(fullPath)] || 'text/plain'});
		res.end(data, 'UTF-8');
	    }
	});
    }/* else {
	console.log('socket io');
    }*/
}

server.on('request', function (req, res) {
    if (req.method === 'POST') {
        req.data = '';
        req.on('readable', function() {
            req.data += req.read() || '';  // If null, add no space.
        });
        req.on('end', function() {
	    console.log('req_on end. before renderForm:' + req.data);
            renderForm(req, res);
        });
    } else {
	//console.log('Not POST. before renderForm');
        renderForm(req, res);
    }
    console.log(req.method + ':' + req.url);
});

console.log('Server running at http://localhost:3000/');

server.listen(3000);

io.sockets.on('connection', function(socket) {
    socket.on('emit_from_client', function(data) {
	var argv = data.split(' ');
	var cmd = '';
	switch(argv[0])
	{
	    case 'led1':
	       if(argv[1] === 'OFF') led_val |= 0x1;
	       else led_val &= 0xE;
	       cmd = '/home/ubuntu/bin/myiptest ' + led_val;
	       break;
	    case 'led2':
	       if(argv[1] === 'OFF') led_val |= 0x2;
	       else led_val &= 0xD;
	       cmd = '/home/ubuntu/bin/myiptest ' + led_val;
	       break;
	    case 'led3':
	       if(argv[1] === 'OFF') led_val |= 0x4;
	       else led_val &= 0xB;
	       cmd = '/home/ubuntu/bin/myiptest ' + led_val;
	       break;
	    case 'led4':
	       if(argv[1] === 'OFF') led_val |= 0x8;
	       else led_val &= 0x7;
	       cmd = '/home/ubuntu/bin/myiptest ' + led_val;
	       break;
	    case 'pwm_range1':
	       cmd = '/home/ubuntu/bin/mypwmtest 0 ' + argv[1];
	       break;
	    case 'pwm_range2':
	       cmd = '/home/ubuntu/bin/mypwmtest 1 ' + argv[1];
	       break;
	    case 'pwm_range3':
	       cmd = '/home/ubuntu/bin/mypwmtest 2 ' + argv[1];
	       break;
	    case 'pwm_range4':
	       cmd = '/home/ubuntu/bin/mypwmtest 3 ' + argv[1];
	       break;
	    case 'pwm_range5':
	       cmd = '/home/ubuntu/bin/mypwmtest 4 ' + argv[1];
	       break;
	    case 'pwm_range6':
	       cmd = '/home/ubuntu/bin/mypwmtest 5 ' + argv[1];
	       break;
	}
	if(cmd != '') {
            console.log(cmd);
	    exec(cmd, (err, stdout, stderr) => {
		if (err) { console.log(err); return; }
//		console.log(stdout);
	    });
	} else {
            console.log('No command:' + data);
	}
    });

    setInterval(function(){
	exec('/home/ubuntu/bin/myiptest ' + led_val, function(err, stdout, stderr){
	    var ii = stdout.indexOf("myip device");
            var ss1 = stdout.substr(ii);
	    var regexp = new RegExp('[0-9]');
	    ii = ss1.search(regexp);
	    var l1 = ss1.substr(ii, 2);
	    if( isNaN(l1) ) l1 = ss1.substr(ii, 1);
	    if( slide_sw_val != l1 ) {
		console.log("Change slide sw:" + l1);
		slide_sw_val = l1;
		socket.emit('switch_data', 'button_sw ' + l1);
	    }
	    var ss2 = ss1.substr(ii + 2);
	    ii = ss2.search(regexp);
	    l1 = ss2.substr(ii, 2);
	    if( isNaN(l1) ) l1 = ss2.substr(ii, 1);
	    if( button_sw_val != l1 ) {
		console.log("Change button sw:" + l1);
		button_sw_val = l1;
		socket.emit('switch_data', 'slide_sw ' + l1);
	    }
	});
    }, 1000);
});
