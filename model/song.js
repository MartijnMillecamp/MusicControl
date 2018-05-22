//require mongoose
var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;


module.exports = mongoose.model('Song', new Schema({
	trackId: String,

	acousticness: Number,
	danceability: Number,
	energy: Number,
	instrumentalness: Number,
	tempo: Number,
	valence: Number,
	artist: String
}));
