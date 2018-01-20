var selectedArtists = [];
var acousticness = 0.5; //float	A confidence measure from 0.0 to 1.0
var danceability = 0.5;
var energy = 0.5;
var valence = 0.5;
var popularity = 50; //integer

$(document).ready(function () {
	setInterval(function () {
		$.ajax("/refresh-token?refresh_token=" + refreshToken, function (data, err) {
			if (err)
				console.log(err);
			else {
				console.log(data);
				spotifyToken = data.access_token;
				refreshToken = data.refresh_token
			}
		})

	}, 3500 * 1000)
})