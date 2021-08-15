const server = require('http').createServer();
const fs = require('fs');
const ejs = require('ejs');
var path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
var qs = require('querystring');
const template = fs.readFileSync(__dirname + '/index.ejs', 'utf-8');
var slide_sw = [ 'OFF',  'OFF',  'OFF',  'ON'];
var button_sw = [ 'OFF',  'OFF',  'OFF',  'OFF'];
var grn_led = [ 'OFF',  'OFF',  'OFF',  'OFF'];
var pwm_led = [ 0, 0, 0, 0, 0, 0 ];
var led_val = 0xF;

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
//	console.log('In renderForm: 1');
	const data = ejs.render(template, {
            slide_sw1: slide_sw[0],
            slide_sw2: slide_sw[1],
            slide_sw3: slide_sw[2],
            slide_sw4: slide_sw[3],
            button_sw1: button_sw[0],
            button_sw2: button_sw[1],
            button_sw3: button_sw[2],
            button_sw4: button_sw[3],
            grn_led1: grn_led[0],
            grn_led2: grn_led[1],
            grn_led3: grn_led[2],
            grn_led4: grn_led[3],
            pwm_led1: pwm_led[0],
            pwm_led2: pwm_led[1],
            pwm_led3: pwm_led[2],
            pwm_led4: pwm_led[3],
            pwm_led5: pwm_led[4],
            pwm_led6: pwm_led[5]
	});
	res.writeHead(200, {'Content-Type' : 'text/html'});
	res.write(data);
	res.end();
    } else {
	//console.log('In renderForm: 2');
	filePath = req.url;
	var fullPath = __dirname + filePath;
	fs.readFile(fullPath, function(err, data) {
	    if (err) {
		sendError(req, res, 404);
	    } else {
		res.writeHead(200, {'Content-Type': mime[path.extname(fullPath)] || 'text/plain'});
		res.end(data, 'UTF-8');
	    }
	});
    }
}

server.on('request', function (req, res) {
    if (req.method === 'POST') {
        req.data = '';
        req.on('readable', function() {
            req.data += req.read() || '';  // If null, add no space.
        });
        req.on('end', function() {
	    //console.log('req_on end');
	    if( req.data === 'slide_switch=Get' )
	    {
		var cmd = '/home/ubuntu/bin/myiptest ' + led_val;
		var cmd_result = String(execSync(cmd));
		var ii = cmd_result.indexOf("myip device");
		var l2 = cmd_result.substr(ii + 28, 2);

		console.log("slide sw:" + l2);
		if( (l2 & 1) != 0 ) slide_sw[0]='ON';
		else slide_sw[0]='OFF';
		if( (l2 & 2) != 0 ) slide_sw[1]='ON';
		else slide_sw[1]='OFF';
		if( (l2 & 4) != 0 ) slide_sw[2]='ON';
		else slide_sw[2]='OFF';
		if( (l2 & 8) != 0 ) slide_sw[3]='ON';
		else slide_sw[3]='OFF';
	    }
	    else if( req.data === 'button_switch=Get' )
	    {
		var cmd = '/home/ubuntu/bin/myiptest ' + led_val;
		var cmd_result = String(execSync(cmd));
		var cmd_result = String(execSync(cmd));
		var ii = cmd_result.indexOf("myip device");
		var l2 = cmd_result.substr(ii + 19, 2);
		console.log("button sw:" + l2);
		if( (l2 & 1) != 0 ) button_sw[0]='ON';
		else button_sw[0]='OFF';
		if( (l2 & 2) != 0 ) button_sw[1]='ON';
		else button_sw[1]='OFF';
		if( (l2 & 4) != 0 ) button_sw[2]='ON';
		else button_sw[2]='OFF';
		if( (l2 & 8) != 0 ) button_sw[3]='ON';
		else button_sw[3]='OFF';
	    }
	    else
	    {
		var ll = qs.parse(req.data);
		if(ll['green_led'] === 'Set')
		{
		    grn_led[0] = ll['set_led1'];
		    grn_led[1] = ll['set_led2'];
		    grn_led[2] = ll['set_led3'];
		    grn_led[3] = ll['set_led4'];
		    led_val = 0;
		    if(grn_led[0] === 'OFF') led_val += 1;
		    if(grn_led[1] === 'OFF') led_val += 2;
		    if(grn_led[2] === 'OFF') led_val += 4;
		    if(grn_led[3] === 'OFF') led_val += 8;
		    var cmd = '/home/ubuntu/bin/myiptest ' + led_val;
		    console.log(cmd);
		    exec(cmd, (err, stdout, stderr) => {
			if (err) { console.log(err); return; }
		    });
		}
		else if(ll['rgb_led'] === 'Set')
		{
		    var cmd = '/home/ubuntu/bin/mypwmtest';
		    if( pwm_led[0] != ll['set_pwm1'] ) {
			pwm_led[0] = ll['set_pwm1'];
			cmd += ' 0 ' + pwm_led[0];
		    }
		    if( pwm_led[1] != ll['set_pwm2'] ) {
			pwm_led[1] = ll['set_pwm2'];
			cmd += ' 1 ' + pwm_led[1];
		    }
		    if( pwm_led[2] != ll['set_pwm3'] ) {
			pwm_led[2] = ll['set_pwm3'];
			cmd += ' 2 ' + pwm_led[2];
		    }
		    if( pwm_led[3] != ll['set_pwm4'] ) {
			pwm_led[3] = ll['set_pwm4'];
			cmd += ' 3 ' + pwm_led[3];
		    }
		    if( pwm_led[4] != ll['set_pwm5'] ) {
			pwm_led[4] = ll['set_pwm5'];
			cmd += ' 4 ' + pwm_led[4];
		    }
		    if( pwm_led[5] != ll['set_pwm6'] ) {
			pwm_led[5] = ll['set_pwm6'];
			cmd += ' 5 ' + pwm_led[5];
		    }
		    console.log(cmd);
		    exec(cmd, (err, stdout, stderr) => {
			if (err) { console.log(err); return; }
			console.log(stdout);
		    });
		}
	    }
//	    console.log('req_on end. before renderForm:' + req.data);
            renderForm(req, res);
        });
    } else {
	//console.log('Not POST. before renderForm');
        renderForm(req, res);
    }
    //console.log(req.method + ':' + req.url);
});
exec('/home/ubuntu/bin/myiptest ' + led_val, (err, stdout, stderr) => {
    if (err) { console.log(err); return; }
    var ii = stdout.indexOf("myip device");
    var l2 = stdout.substr(ii + 28, 2);

    console.log("slide sw:" + l2);
    if( (l2 & 1) != 0 ) slide_sw[0]='ON';
    else slide_sw[0]='OFF';
    if( (l2 & 2) != 0 ) slide_sw[1]='ON';
    else slide_sw[1]='OFF';
    if( (l2 & 4) != 0 ) slide_sw[2]='ON';
    else slide_sw[2]='OFF';
    if( (l2 & 8) != 0 ) slide_sw[3]='ON';
    else slide_sw[3]='OFF';

    var l2 = stdout.substr(ii + 19, 2);
    console.log("button sw:" + l2);
    if( (l2 & 1) != 0 ) button_sw[0]='ON';
    else button_sw[0]='OFF';
    if( (l2 & 2) != 0 ) button_sw[1]='ON';
    else button_sw[1]='OFF';
    if( (l2 & 4) != 0 ) button_sw[2]='ON';
    else button_sw[2]='OFF';
    if( (l2 & 8) != 0 ) button_sw[3]='ON';
    else button_sw[3]='OFF';
});

console.log('Server running at http://localhost:3000/');

server.listen(3000);
