var selectedArtists = [];
var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
var userID = $.cookie('userid');
var numberOfSongs = 10;
var dislikedSongs = [];
var likedSongs = [];
var targetValues = {
	acousticness: 0.5,
	popularity: 50,
	happiness: 0.50,
	danceability: 0.50,
	energy: 0.50
};

$(document).ready(function() {
	//refresh the token
	setInterval(function () {
		$.json("/refresh-token?refresh_token=" + refreshToken, function (data, err) {
			if (err)
				console.log(err);
			else {
				spotifyToken = data.access_token;
				refreshToken = data.refresh_token;
			}
		})

	}, 3500 * 1000)
});


function addRecord(user, element, action, value) {
	var query = '/addInteraction?userName=' + user + '&element=' + element + '&action=' + action + '&value=' + value;
	$.getJSON(query, function (data) {
		// console.log(data)
	})
}
