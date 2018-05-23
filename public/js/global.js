var selectedArtists = [];
var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
var userID = $.cookie('userId');
var userName = $.cookie('userName');
var random = $.cookie('random');
var base = '';
var numberOfSongs = 10;
var dislikedSongs = [];
var likedSongs = [];
var targetValues = {
	acousticness: 0.5,
	instrumentalness: 50,
	valence: 0.50,
	danceability: 0.50,
	energy: 0.50
};
var recommendedSongs = [];


$(document).ready(function() {

	//refresh the token
	setInterval(function () {
		$.json(base + "/refresh-token?refresh_token=" + refreshToken, function (data, err) {
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
	var query = base + '/addInteraction?userName=' + userName + '&userId=' + userID + '&element=' + element + '&action=' + action + '&value=' + value;
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

function appendRecommendation(song, last){
	recommendedSongs.push(song)
	if(last){
		updateScatterplot(recommendedSongs)
	}
}

function removeRecommendation(artist) {
	var removeList = [];

	recommendedSongs.forEach(function (d,i) {
		if(d.artist === artist){
			removeList.push(i)
		}
	});

	for (var i = removeList.length -1; i >= 0; i--){
		recommendedSongs.splice(removeList[i],1);
	}
	updateScatterplot(recommendedSongs)
}

