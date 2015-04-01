#! /usr/bin/env node

var configPath = process.argv[2];
if(!configPath) {
    throw new Error('You must pass a path to a config file');
}

var fs = require('fs');
var path = require('path');
var configStr = fs.readFileSync(configPath);
var config = JSON.parse(configStr);

var async = require('async');

require('colors');

var Pattern = require(__dirname + '/lib/Pattern');

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