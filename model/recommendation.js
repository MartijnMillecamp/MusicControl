//require mongoose
var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;


module.exports = mongoose.model('Recommendations', new Schema({
	userId: String,
	userName: String,
	date: Date,
	acousticness: Number,
	popularity: Number,
	danceability: Number,
	valence: Number,
	energy: Number,
	likedSongs: Number,
	dislikedSongs: Number
}));