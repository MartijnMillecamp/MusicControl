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
var colorList = ['#69c242', '#64bbe3', '#ffcc00', '#ff7300', '#cf2030'];
var artists = [];


$(document).ready(function() {
	console.log($.cookie())

	//refresh the token after 600s (10min)
	setInterval(function () {
		$.getJSON(base + "/refresh-token?refresh_token=" + refreshToken, function (data, err) {
			console.log("data", data)
			if (err)
				console.log(err);
			else {
				spotifyToken = data.access_token;
				refreshToken = data.refresh_token;
			}
		})
	}, 600*1000)

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

/**
 * Append song to recommendedSongs and update
 * scatterplot and recommendations if needed
 * @param song
 * @param update: update scatterplot if and only if this is true
 * @param similarArtist update recommendations of this artis
 */
function appendRecommendation(song, update, similarArtist){
	recommendedSongs.push(song);
	if(update){
		updateScatterplot(recommendedSongs);
		updateRecommendations(recommendedSongs, similarArtist);
	}
}



function removeRecommendation(artist) {
	var removeList = [];

	recommendedSongs.forEach(function (d,i) {
		if(d.similarArtist === artist){
			removeList.push(i)
		}
	});

	for (var i = removeList.length -1; i >= 0; i--){
		recommendedSongs.splice(removeList[i],1);
	}
	updateScatterplot(recommendedSongs);
	//Delete all recommendations of this artist
	$('#recList_' + artist).html("")
	updateRecommendations(recommendedSongs, artist)
}

function getArtistColor(artistId){
	var artistIndex = artists.indexOf(artistId);
	if (artistIndex == -1){ return "grey"}
	else{
		return colorList[artistIndex]
	}
}


