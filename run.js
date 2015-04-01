var fs = require('fs');
var path = require('path');
var configStr = fs.readFileSync(path.join(__dirname, 'config.json'));
var config = JSON.parse(configStr);

var async = require('async');

require('colors');

var Pattern = require('./lib/pattern');

var patterns = [];
for(var i=0; i<config.patterns.length; i++) {
	patterns.push(new Pattern(config.patterns[i]));
}

async.each(patterns, function(pattern, callback) {
	pattern.cleanup(callback);
}, function(err) {
	if(err) {
		console.log('ERROR:'.red, err);
		process.exit(1);
	}

	console.log(('\nCompleted successfully for '+patterns.length+' patterns').green);
	process.exit(0);
});