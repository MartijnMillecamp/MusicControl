var selectedArtists = [];
var acousticness = 0.5; //float	A confidence measure from 0.0 to 1.0
var danceability = 0.5;
var energy = 0.5;
var valence = 0.5;
var popularity = 50; //integer
var numberOfSongs = 10;
var dislikedSongs = [];
var likedSongs = [];

$(document).ready(function() {
	console.log("refresh global.js");
	//refresh the token
	setInterval(function () {
		$.json("/refresh-token?refresh_token=" + refreshToken, function (data, err) {
			console.log("refresh in interval")
			if (err)
				console.log(err);
			else {
				console.log(data);
				spotifyToken = data.access_token;
				refreshToken = data.refresh_token;
			}
		})

	}, 3500 * 1000)
});
