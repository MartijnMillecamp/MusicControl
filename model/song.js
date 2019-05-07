//require mongoose
var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;


module.exports = mongoose.model('Song', new Schema({
	trackId: String,
	artist: String,
	title: String,
	url: String,
	preview: String,
	image: String,

	acousticness: Number,
	danceability: Number,
	duration: Number,
	energy: Number,
	instrumentalness: Number,
	liveness: Number,
	loudness: Number,
	popularity: Number,
	speechiness: Number,
	tempo: Number,
	valence: Number,
	similarArtist: String

}));
