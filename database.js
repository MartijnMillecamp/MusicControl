const mongoose = require('mongoose');


exports.initializeMongo = function () {
	mongoose.connect("mongodb://localhost:27017/testDocker", function (err) {
		if (err) {
			console.log("connection error", err);

		} else {
			console.log('connection successful!');
		}
	});
};
