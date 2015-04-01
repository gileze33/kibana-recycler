var request = require('request');

require('colors');

var Host = function Host(base) {
	// set a default base URL
	if(!base) {
		base = 'http://localhost:9200';
	}

	this.base = base;
};
Host.prototype.request = function(path, opts, cb) {
	if(!cb) {
		cb = opts;
		opts = {};
	}

	opts.url = this.base + path;

	console.log('Host#request'.cyan, opts);

	request(opts, function(err, response, data) {
		if(err) {
			return cb(err);
		}

		try {
			if(typeof(data) === 'string') {
				if(opts.parseJSON !== false) {
					data = JSON.parse(data);
				}
			}

			cb(null, data);
		}
		catch(e) {
			cb(e);
		}
	});
};

module.exports = Host;