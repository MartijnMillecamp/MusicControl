//require mongoose
var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;


module.exports = mongoose.model('Interactions', new Schema({
	userId: String,
	userName: String,
	userNumber: Number,
	interfaceNumber: Number,
	date: Number,
	element: String,
	action: String,
	value: String
}));

