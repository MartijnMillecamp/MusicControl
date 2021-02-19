const mongoose = require('mongoose');
var config = require('./configLocal');

exports.initializeMongo = function () {
	mongoose.connect(config.database, function (err) {
		if (err) {
			console.log("connection error", err);

		} else {
			console.log('connection successful!');
		}
	});
};
