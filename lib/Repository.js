var Repository = function Repository(data) {
	for(var k in data) {
		this[k] = data[k];
	}
};

module.exports = Repository;