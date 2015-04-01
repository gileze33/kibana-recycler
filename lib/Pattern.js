var request = require('request');
var async = require('async');

require('colors');

var Host = require('./Host');

var Pattern = function Pattern(data) {
	for(var k in data) {
		this[k] = data[k];
	}

	// validate
	if(!this.match) {
		throw new Error('A pattern has no "match" property');
	}

	// set default window if none found
	if(!this.window) {
		console.log('WARNING:'.yellow, 'A pattern has no "window" property - defaulting to 7');
		this.window = 7;
	}

	// replace the host prop with an actual host instance
	this.host = new Host(this.host);

	return this;
};
Pattern.prototype._search = function _search(cb) {
	var self = this;

	self.host.request('/'+self.match, function(err, response) {
		if(err) {
			return cb(err);
		}

		// create a list of all the indexes with most recent first
		var indexes = [];
		for(var k in response) {
			indexes.push(k);
		}
		indexes.sort().reverse();

		// compile a list of indexes to remove, taking into account this patterns window
		var indexesToRemove = [];
		if(indexes.length > self.window) {
			for(var i=self.window; i<indexes.length; i++) {
				indexesToRemove.push(indexes[i]);
			}
		}

		cb(null, indexesToRemove);
	});
};
Pattern.prototype.cleanup = function cleanup(cb) {
	var self = this;

	self._search(function(err, indexesToRemove) {
		if(err) {
			return cb(err);
		}

		async.each(indexesToRemove, function(index, callback) {
			self.host.request('/'+index, {
				method: 'DELETE'
			}, function(err, response) {
				if(err) {
					return cb(err);
				}

				if(response.acknowledged) {
					cb(null);
				}
				else {
					cb({
						index: index,
						acknowledged: false
					});
				}
			});
		}, function(err) {
			if(err) {
				return cb(err);
			}

			//console.log('INFO: Removed', indexesToRemove.length, 'indexes for pattern', self.match)

			cb(null);
		});
	});
};

module.exports = Pattern;