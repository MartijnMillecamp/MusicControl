const mongoose = require('mongoose');


exports.initializeMongo = function () {
	//!!! needs to be the same name as the service in docker-compose !!!
	var dockerDB = "mongodb://mongo:27017/testDocker";
	var localDB = "mongodb://localhost:27017/localTest";
	mongoose.connect(localDB, function (err) {
		if (err) {
			console.log("connection error", err);

		} else {
			console.log('connection successful!');
		}
	});
};
