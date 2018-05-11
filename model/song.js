//require mongoose
var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;


module.exports = mongoose.model('Song', new Schema({
	trackId: String,
	energy: Number,
	acousticness: Number
}));
