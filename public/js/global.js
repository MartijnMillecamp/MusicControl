var selectedArtists = [];
var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
var userID = $.cookie('userId');
var userName = $.cookie('userName');

var random = $.cookie('random');

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


function addRecord(element, action, value) {
	var query = '/addInteraction?userName=' + userName + '&userId=' + userID + '&element=' + element + '&action=' + action + '&value=' + value;
	$.getJSON(query, function (data) {
		// console.log(data)
	})
}

function flashButton(flash){
	var button = $( "#calculateButton" )
	var flashing = button.hasClass( "flashingButton" );
	if (flash && !flashing){
		button.addClass('flashingButton')
	}
	else if(!flash && flashing){
		button.removeClass('flashingButton')
	}

}
