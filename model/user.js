
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
	userId: String,
	userName: String,
	userNumber: Number,
	screenSize: String,

	relaxing: Boolean,
	fun: Boolean,
	explanations: Boolean,
	baseline: Boolean
}));