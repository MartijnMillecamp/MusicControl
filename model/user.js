
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
	userId: Number,
	screenSize: String,
	
	playable: Number,
	baseline: Number,
	unplayable: Number,
	relaxing: Number,
	fun: Number,
	sport: Number,
	current: Number
}));