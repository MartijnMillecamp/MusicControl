
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
	userId: String,
	userName: String,
	userNumber: Number,
  firstInterface: Number,
	screenSize: String
}));