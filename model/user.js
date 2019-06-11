
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
	userId: Number,
	screenSize: String,
	
	playable: Number,
	baseline: Number,
	relaxing: Number,
	fun: Number,
	current: Number
}));