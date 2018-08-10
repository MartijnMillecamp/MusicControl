//require mongoose
var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;


module.exports = mongoose.model('Playlist', new Schema({
	userId: String,
	interface: String,
	playlist: [String],
	nbRecommendations: Number
}));
