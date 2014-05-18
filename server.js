var connect = require('connect');
var open = require('open');

var port = 8080;

connect().use(connect.static(__dirname)).listen(port);
console.log('Connected on port ' + port);

console.log('Opening browser...');
open('http://localhost:' + port + '/test.html');
